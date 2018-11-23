const debug = require('debug')('repository:reports')
const _ = require('lodash')
const moment = require('moment')
const { Company } = require('../companies/companies.model')
const { ControlPoint } = require('../control_points/control_points.model')
const { DeviceData } = require('../device_data/device_data.model')
const { EventRecord } = require('../event_record/event_record.model')
const { AlertHistory } = require('../alert_history/alert_history.model')
const { Family } = require('../families/families.model')
const { Packing } = require('../packings/packings.model')
const { User } = require('../users/users.model')

exports.general_report = async () => {
    try {
        const aggregate = await Packing.aggregate([
            {
                $lookup: {
                    from: 'families',
                    localField: 'family',
                    foreignField: '_id',
                    as: 'family_object',
                },
            },
            {
                $unwind: {
                    path: '$family_object',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$family_object._id',
                    company: {
                        $first: '$family_object.company'
                    },
                    packings_quantity: { $sum: 1 },
                },
            }
        ])
        
        const data = await Promise.all(
            aggregate.map(async aggr => {
                let res = {}

                const family = await Family.findById(aggr._id)
                    .populate('company')

                res = {
                    family,
                    packings_quantity: aggr.packings_quantity
                }
                return res
            })
        )

        debug(data)
        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.general_inventory_report = async () => {
    try {
        const aggregate = await Packing.aggregate([
            {
                $lookup: {
                    from: 'families',
                    localField: 'family',
                    foreignField: '_id',
                    as: 'family_object',
                },
            },
            {
                $unwind: {
                    path: '$family_object',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$family_object._id',
                    company: {
                        $first: '$family_object.company'
                    },
                    packings_quantity: { $sum: 1 },
                },
            }
        ])

        const data = await Promise.all(
            aggregate.map(async aggr => {
                let res = {}

                const family = await Family.findById(aggr._id)
                    .populate('company')

                res = {
                    family,
                    packings_quantity: aggr.packings_quantity
                }
                return res
            })
        )

        debug(data)
        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.snapshot_report = async () => {
    try {
        const packings = await Packing.find({})
            .populate('family')
            .populate('last_device_data')
            .populate('last_event_record')

        const data = await Promise.all(
            packings.map(async (packing, index) => {
                let obj = {}

                obj.id = packing._id
                obj.message_date = packing.last_device_data ? packing.last_device_data.message_date : '-'
                obj.family = packing.family.code
                obj.serial = packing.serial
                obj.tag = packing.tag.code
                obj.current_state = packing.current_state
                obj.collection_date = `${moment().locale('pt-br').format('L')} ${moment().locale('pt-br').format('LT')}`
                obj.accuracy = packing.last_device_data ? packing.last_device_data.accuracy : '-'
                obj.lat_lng = await getLatLngOfPacking(packing)
                obj.lat_lng_cp = packing.last_event_record && packing.last_event_record.type === 'inbound' ? await getLatLngOfControlPoint(packing) : '-'
                obj.control_point_local = packing.last_event_record && packing.last_event_record.type === 'inbound' ? await getTypeOfControlPoint(packing) : '-'
                obj.control_point_name = packing.last_event_record && packing.last_event_record.type === 'inbound' ? await getNameOfControlPoint(packing) : '-'
                obj.geo = 'C'
                obj.area = '-'
                obj.permanence_time = packing.last_event_record && packing.last_event_record.type === 'inbound' ? getDiffDateTodayInDays(packing.last_event_record.created_at) : '-'
                obj.signal = packing.current_state === 'sem_sinal' ? 'FALSE' : packing.current_state === 'desabilitada_sem_sinal' ? 'FALSE' : packing.current_state === 'perdida' ? 'FALSE' : 'TRUE'
                obj.absent_time_countdown = await getAbsentTimeCountDown(packing)
                obj.battery = packing.last_device_data ? packing.last_device_data.battery.percentage : "-"

                return obj
            })
        )

        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.absent_report = async (query = { family: null, serial: null }) => {
    try {
        const packings = await Packing.find({ absent: true, active: true })
            .populate('family')
            .populate('last_device_data')
            .populate('last_event_record')

        const data = await Promise.all(
            packings.map(async packing => {
                let object_temp = {}

                object_temp._id = packing._id
                object_temp.tag = packing.tag
                object_temp.weigth = packing.weigth
                object_temp.width = packing.width
                object_temp.heigth = packing.heigth
                object_temp.length = packing.length
                object_temp.capacity = packing.capacity
                object_temp.temperature = packing.temperature
                object_temp.active = packing.active
                object_temp.absent = packing.absent
                object_temp.low_battery = packing.low_battery
                object_temp.permanence_time_exceeded = packing.permanence_time_exceeded
                object_temp.current_state = packing.current_state
                object_temp.family = packing.family
                object_temp.serial = packing.serial
                object_temp.created_at = packing.created_at
                object_temp.update_at = packing.update_at
                packing.last_device_data ? object_temp.last_device_data = packing.last_device_data : null
                packing.last_event_record ? object_temp.last_event_record = packing.last_event_record : null
                packing.last_alert_history ? object_temp.last_alert_history = packing.last_alert_history : null
                
                if (packing.last_event_record && packing.last_event_record.type === 'inbound') {
                    object_temp.absent_time = getDiffDateTodayInDays(packing.last_event_record.created_at)
                } else {
                    object_temp.absent_time = await getAbsentTimeCountDown(packing)
                }
                

                return object_temp
            })
        )

        return data
    } catch (error) {
        throw new Error(error)
    }
}

const getLatLngOfPacking = async (packing) => {
    // const current_device_data = await DeviceData.findById(packing.last_device_data._id)
    if (!packing.last_device_data) return '-'
    return `${packing.last_device_data.latitude} ${packing.last_device_data.longitude}`
}

const getLatLngOfControlPoint = async (packing) => {
    const current_control_point = await ControlPoint.findById(packing.last_event_record.control_point)
    return `${current_control_point.lat} ${current_control_point.lng}`
}

const getTypeOfControlPoint = async (packing) => {
    const current_control_point = await ControlPoint.findById(packing.last_event_record.control_point).populate('type')
    return current_control_point.type.name
}

const getNameOfControlPoint = async (packing) => {
    const current_control_point = await ControlPoint.findById(packing.last_event_record.control_point).populate('type')
    return current_control_point.name
}

const getAbsentTimeCountDown = async (packing) => {
    let diff_date_array = []
    
    if (packing.last_event_record) {
        const event_records = await EventRecord.find({ packing: packing._id, type: 'outbound' }).sort({ created_at: -1 })
        if (!event_records.length > 0) return '-'

        diff_date_array = await Promise.all(
            event_records.map(async event_record => {
                let created_at = {}

                const current_control_point = await ControlPoint.findOne({ _id: event_record.control_point }).populate('company')
                created_at = current_control_point.company.type === 'owner' ? event_record.created_at : null

                return getDiffDateTodayInDays(created_at)
            })
        )

        const data = diff_date_array.reduce((count, element) => element > count ? count = element : count)

        return data
    }
    return '-'
}

const getDiffDateTodayInDays = (date) => {
    const today = moment()
    date = moment(date)

    const duration = moment.duration(today.diff(date))
    return duration.asHours()
}