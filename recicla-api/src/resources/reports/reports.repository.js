const debug = require('debug')('repository:reports')
const _ = require('lodash')
const moment = require('moment')
const { Company } = require('../companies/companies.model')
const { ControlPoint } = require('../control_points/control_points.model')
const { EventRecord } = require('../event_record/event_record.model')
const { Family } = require('../families/families.model')
const { Packing } = require('../packings/packings.model')
const { GC16 } = require('../gc16/gc16.model')
const { Setting } = require('../settings/settings.model')

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
                $lookup: {
                    from: 'projects',
                    localField: 'project',
                    foreignField: '_id',
                    as: 'project_object',
                },
            },
            {
                $unwind: {
                    path: '$project_object',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$family_object._id',
                    company: {
                        $first: '$family_object.company'
                    },
                    project_name: {
                        $first: '$project_object.name'
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
                    .populate('project')

                res = {
                    family,
                    packings_quantity: aggr.packings_quantity,
                    project_name: aggr.project_name
                }
                return res
            })
        )
        
        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.general_inventory_report = async () => {
    try {
        const families = await Family.find({}).populate('company')
        const families_with_packings = await Promise.all(
            families.map(async (family) => {
                let family_obj = {}

                const qtd_total = await Packing.find({ family: family._id, active: true }).count()
                const qtd_in_owner = await Packing.find({ family: family._id, absent: false, active: true }).count()
                const qtd_in_analysis = await Packing.find({ family: family._id, current_state: 'analise', active: true }).count()
                const qtd_in_traveling = await Packing.find({ family: family._id, current_state: 'viagem_em_prazo', active: true }).count()
                const qtd_in_traveling_late = await Packing.find({ family: family._id, current_state: 'viagem_atrasada', active: true }).count()
                const qtd_in_traveling_missing = await Packing.find({ family: family._id, current_state: 'viagem_perdida', active: true }).count()
                const qtd_in_correct_cp = await Packing.find({ family: family._id, current_state: 'local_correto', active: true }).count()
                const qtd_in_incorrect_cp = await Packing.find({ family: family._id, current_state: 'local_incorreto', active: true }).count()
                const qtd_with_permanence_time_exceeded = await Packing.find({ family: family._id, permanence_time_exceeded: true, active: true }).count()
                const qtd_missing = await Packing.find({ family: family._id, current_state: 'perdida', active: true }).count()
                const locations = await general_inventory_report_detailed(family._id)

                family_obj.company = family.company.name
                family_obj.family_name = family.code
                family_obj.qtd_total = qtd_total 
                family_obj.qtd_in_owner = qtd_in_owner + qtd_in_analysis
                family_obj.qtd_in_analysis = qtd_in_analysis 
                family_obj.qtd_in_cp = qtd_in_correct_cp + qtd_in_incorrect_cp
                family_obj.qtd_in_traveling = qtd_in_traveling + qtd_in_traveling_late + qtd_in_traveling_missing
                family_obj.qtd_in_traveling_late = qtd_in_traveling_late
                family_obj.qtd_in_traveling_missing = qtd_in_traveling_missing
                family_obj.qtd_in_incorrect_cp = qtd_in_incorrect_cp
                family_obj.qtd_with_permanence_time_exceeded = qtd_with_permanence_time_exceeded
                family_obj.qtd_missing = qtd_missing
                family_obj.locations = Object.entries(_.countBy(locations, 'control_point_name')).map(([key, value]) => ({cp: key, qtd: value}))

                return family_obj
            })
        )

        return families_with_packings
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
        const settings = await Setting.find({})

        const data = await Promise.all(
            packings.map(async packing => {
                let obj = {}

                obj.id = packing._id
                obj.message_date = packing.last_device_data ? `${moment(packing.last_device_data.message_date).locale('pt-br').format('L')} ${moment(packing.last_device_data.message_date).locale('pt-br').format('LT')}` : '-'
                obj.family = packing.family.code
                obj.serial = packing.serial
                obj.tag = packing.tag.code
                obj.current_state = packing.current_state
                obj.collect_date = `${moment().locale('pt-br').format('L')} ${moment().locale('pt-br').format('LT')}`
                obj.accuracy = packing.last_device_data ? packing.last_device_data.accuracy : '-'
                obj.lat_lng_device = await getLatLngOfPacking(packing)
                obj.lat_lng_cp = packing.last_event_record && packing.last_event_record.type === 'inbound' ? await getLatLngOfControlPoint(packing) : '-'
                obj.cp_type = packing.last_event_record && packing.last_event_record.type === 'inbound' ? await getTypeOfControlPoint(packing) : '-'
                obj.cp_name = packing.last_event_record && packing.last_event_record.type === 'inbound' ? await getNameOfControlPoint(packing) : '-'
                obj.geo = 'C'
                obj.area = `{(${await getLatLngOfPacking(packing)}),${settings[0].range_radius}}`
                obj.permanence_time = packing.last_event_record && packing.last_event_record.type === 'inbound' ? getDiffDateTodayInDays(packing.last_event_record.created_at) : '-'
                obj.signal = packing.current_state === 'sem_sinal' ? 'FALSE' : packing.current_state === 'desabilitada_sem_sinal' ? 'FALSE' : packing.current_state === 'perdida' ? 'FALSE' : 'TRUE'
                obj.absent_time = await getAbsentTimeCountDown(packing)
                obj.battery = packing.last_device_data ? packing.last_device_data.battery.percentage : "-"
                obj.battery_alert = packing.last_device_data && packing.last_device_data.battery.percentage > settings[0].battery_level_limit ? 'FALSE' : 'TRUE'
                obj.travel_time = packing.last_event_record && packing.last_event_record.type === 'outbound' ? getDiffDateTodayInDays(packing.last_event_record.created_at) : "-"

                return obj
            })
        )

        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.absent_report = async (query = { family: null, serial: null, absent_time_in_hours: null }) => {
    try {
        let packings = []
        let current_family = query.family ? await Family.findOne({ _id: query.family }) : null

        switch(true) {
            case query.family != null && query.serial != null:
                packings = await Packing.find({ absent: true, active: true, family: current_family._id, serial: query.serial })
                    .populate('family')
                    .populate('last_device_data')
                    .populate('last_event_record')
                break
            case query.family != null:
                packings = await Packing.find({ absent: true, active: true, family: current_family._id })
                    .populate('family')
                    .populate('last_device_data')
                    .populate('last_event_record')
                break
            case query.serial != null:
                packings = await Packing.find({ absent: true, active: true, serial: query.serial })
                    .populate('family')
                    .populate('last_device_data')
                    .populate('last_event_record')
                break
            default:
                packings = await Packing.find({ absent: true, active: true })
                    .populate('family')
                    .populate('last_device_data')
                    .populate('last_event_record')
                break
        }

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
                packing.last_event_record ? object_temp.last_event_record = await EventRecord.findById(packing.last_event_record).populate('control_point') : null
                packing.last_current_state_history ? object_temp.last_current_state_history = packing.last_current_state_history : null

                if (packing.last_event_record && packing.last_event_record.type === 'inbound') {
                    object_temp.absent_time_in_hours = getDiffDateTodayInDays(packing.last_event_record.created_at)
                } else {
                    object_temp.absent_time_in_hours = await getAbsentTimeCountDown(packing)
                }
                

                return object_temp
            })
        )
        
        if (query.absent_time_in_hours != null) {
            const packings_filtered = data.filter(packing => packing.absent_time_in_hours < query.absent_time_in_hours)
            return packings_filtered
        }

        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.permanence_time_report = async (query = { family: null, serial: null }) => {
    try {
        let packings = []
        let current_family = query.family ? await Family.findOne({ _id: query.family }) : null

        switch (true) {
            case query.family != null && query.serial != null:
                packings = await Packing.find({ absent: true, active: true, family: current_family._id, serial: query.serial })
                    .populate('family')
                    .populate('last_device_data')
                    .populate('last_event_record')
                break
            case query.family != null:
                packings = await Packing.find({ absent: true, active: true, family: current_family._id })
                    .populate('family')
                    .populate('last_device_data')
                    .populate('last_event_record')
                break
            case query.serial != null:
                packings = await Packing.find({ absent: true, active: true, serial: query.serial })
                    .populate('family')
                    .populate('last_device_data')
                    .populate('last_event_record')
                break
            default:
                packings = await Packing.find({ absent: true, active: true })
                    .populate('family')
                    .populate('last_device_data')
                    .populate('last_event_record')
                break
        }

        let data = []
        if (query.serial != null) {
            data = await Promise.all(
                packings
                    .filter(packing => packing.last_event_record && packing.last_event_record.type === 'inbound')
                    .map(async packing => {
                        let object_temp = {}
                        let stock_in_days = null
                        
                        const current_control_point = await ControlPoint.findById(packing.last_event_record.control_point).populate('type')
                        const current_company = await Company.findById(packing.family.company)
                        const gc16 = packing.family.gc16 ? await GC16.findById(packing.family.gc16) : null
                        if (gc16) stock_in_days = current_company.type === 'owner' ? gc16.owner_stock : gc16.client_stock

                        object_temp._id = packing._id
                        object_temp.tag = packing.tag
                        object_temp.family_id = packing.family._id
                        object_temp.family_code = packing.family.code
                        object_temp.serial = packing.serial
                        object_temp.current_control_point_name = current_control_point.name
                        object_temp.current_control_point_type = current_control_point.type.name
                        object_temp.date = packing.last_event_record.created_at
                        object_temp.permanence_time_exceeded = getDiffDateTodayInDays(packing.last_event_record.created_at)
                        if (gc16) object_temp.stock_in_days = stock_in_days.days

                        return object_temp
                    })
            )
        } else {
            data = await Promise.all(
                packings
                    .filter(packing => packing.last_event_record && packing.last_event_record.type === 'inbound')
                    .map(async packing => {
                        let object_temp = {}

                        const current_control_point = await ControlPoint.findById(packing.last_event_record.control_point).populate('type')
                        const current_company = await Company.findById(packing.family.company)

                        object_temp._id = packing._id
                        object_temp.tag = packing.tag
                        object_temp.family_id = packing.family._id
                        object_temp.family_code = packing.family.code
                        object_temp.serial = packing.serial
                        object_temp.current_control_point_name = current_control_point.name
                        object_temp.current_control_point_type = current_control_point.type.name
                        object_temp.permanence_time_exceeded = getDiffDateTodayInDays(packing.last_event_record.created_at)
                        object_temp.company = current_company.name

                        return object_temp
                    })
            )
        }

        if (query.absent_time_in_hours != null) {
            const packings_filtered = data.filter(packing => packing.absent_time_in_hours < query.absent_time_in_hours)
            return packings_filtered
        }

        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.battery_report = async (family_id = null) => {
    try {
        let packings = []
        let current_family = family_id ? await Family.findOne({ _id: family_id }) : null

        switch (true) {
            case family_id != null:
                packings = await Packing.find({ active: true, family: current_family._id })
                    .populate('family')
                    .populate('last_device_data')
                    .populate('last_event_record')
                break
            default:
                packings = await Packing.find({ active: true })
                    .populate('family')
                    .populate('last_device_data')
                    .populate('last_event_record')
                break
        }

        const data = await Promise.all(
            packings
                .filter(packing => packing.last_device_data)
                .map(async packing => {
                    let object_temp = {}

                    const current_control_point = packing.last_event_record ? await ControlPoint.findById(packing.last_event_record.control_point).populate('type') : null

                    object_temp._id = packing._id
                    object_temp.tag = packing.tag
                    object_temp.family_id = packing.family._id
                    object_temp.family_code = packing.family.code
                    object_temp.serial = packing.serial
                    object_temp.current_control_point_name = current_control_point ? current_control_point.name : 'Fora de um ponto de controle'
                    object_temp.current_control_point_type = current_control_point ? current_control_point.type.name : 'Fora de um ponto de controle'
                    object_temp.battery_percentage = packing.last_device_data.battery.percentage
                    object_temp.battery_level = packing.last_device_data.battery.percentage < 20 ? 'Baixa' : packing.last_device_data.battery.percentage < 80 ? 'Média' : 'Alta' 

                    return object_temp
                })
        )

        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.quantity_report = async (family_id = null) => {
    try {
        let data = []
        const families = family_id ? await Family.find({ _id: family_id }).populate('company').populate('gc16').populate('routes').populate('control_points') : await Family.find({}).populate('company').populate('gc16').populate('routes').populate('control_points')
        
        for (let family of families) {
            let stock = null

            if (family.gc16) stock = family.company.type === 'owner' ? family.gc16.owner_stock : family.gc16.client_stock
            const packings = await Packing.find({ family: family._id, active: true }).populate('last_event_record')
            const qtd_total = await Packing.find({ family: family._id, active: true }).count()
            // const qtd_analysis = await Packing.find({ family: family._id, current_state: 'analise' }).count()
            const packings_outbound = packings.filter(packing => packing.last_event_record && packing.last_event_record.type === 'outbound')
            const packings_inbound = await Promise.all(
                packings
                    .filter(packing => packing.last_event_record && packing.last_event_record.type === 'inbound')
                    .map(async packing => {
                        let obj_temp = {}
                        const cp = await ControlPoint.findById(packing.last_event_record.control_point).populate('type')

                        obj_temp.control_point_name = cp.name
                        obj_temp.control_point_type = cp.type.name

                        return obj_temp
                    })
            )
            
            const output = Object.entries(_.countBy(packings_inbound, 'control_point_name')).map(([key, value]) => {
                const packing_temp = packings_inbound.filter(p => p.control_point_name === key)
                return {
                    family_code: family.code,
                    company: family.company.name,
                    stock_min: stock ? stock.qty_container : '-',
                    stock_max: stock ? stock.qty_container_max : '-',
                    packings_traveling: packings_outbound.length,
                    total: value,
                    control_point_name: key,
                    control_point_type: packing_temp[0].control_point_type,
                    qtd_total: qtd_total
                }   
            })

            data.push(output)
        }

        return _.flatMap(data)
    } catch (error) {
        throw new Error(error)
    }
}

exports.general_info_report = async(family_id = null) => {
    try {
        let current_family = family_id ? await Family.findOne({ _id: family_id }) : null
        let packings = family_id != null ? 
            await Packing.find({ active: true, family: current_family._id })
                .populate('family')
                .populate('last_device_data')
                .populate('last_event_record') 
            :
            await Packing.find({ active: true })
                .populate('family')
                .populate('last_device_data')
                .populate('last_event_record')

        const data = await Promise.all(
            packings
                .map(async packing => {
                    let object_temp = {}

                    const current_control_point = packing.last_event_record ? await ControlPoint.findById(packing.last_event_record.control_point).populate('type') : null
                    const company = await Company.findById(packing.family.company)

                    object_temp._id = packing._id
                    object_temp.tag = packing.tag.code
                    object_temp.family_code = packing.family.code
                    object_temp.serial = packing.serial
                    object_temp.company = company.name
                    object_temp.current_state = packing.current_state
                    object_temp.current_control_point_name = current_control_point ? current_control_point.name : 'Fora de um ponto de controle'
                    object_temp.current_control_point_type = current_control_point ? current_control_point.type.name : 'Fora de um ponto de controle'
                    object_temp.battery_percentage = packing.last_device_data ? packing.last_device_data.battery.percentage : 'Sem registro'
                    object_temp.accuracy = packing.last_device_data ? packing.last_device_data.accuracy : 'Sem registro'
                    object_temp.date = packing.last_device_data ? packing.last_device_data.created_at : 'Sem registro'

                    return object_temp
                })
        )

        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.clients_report = async(company_id = null) => {
    try {
        let data = []
        const families = company_id ? 
            await Family.find({ company: company_id })
                .populate('company')
                .populate('gc16')
                .populate('routes')
                .populate('control_points')
            :
            await Family.find({})
                .populate('company')
                .populate('gc16')
                .populate('routes')
                .populate('control_points')

        for (let family of families) {

            const packings = await Packing.find({ family: family._id, active: true }).populate('last_event_record')
            const packings_outbound = packings.filter(packing => packing.last_event_record && packing.last_event_record.type === 'outbound')
            const packings_inbound = await Promise.all(
                packings
                    .filter(packing => packing.last_event_record && packing.last_event_record.type === 'inbound')
                    .map(async packing => {
                        let obj_temp = {}
                        const cp = await ControlPoint.findById(packing.last_event_record.control_point).populate('type')

                        obj_temp.control_point_name = cp.name
                        obj_temp.control_point_type = cp.type.name

                        return obj_temp
                    })
            )

            const output = Object.entries(_.countBy(packings_inbound, 'control_point_name')).map(([key, value]) => {
                const packing_temp = packings_inbound.filter(p => p.control_point_name === key)
                return {
                    family_code: family.code,
                    company: family.company.name,
                    packings_traveling: packings_outbound.length,
                    control_point_name: key,
                    control_point_type: packing_temp[0].control_point_type,
                    qtd: value
                }
            })

            data.push(output)
        }

        return _.flatMap(data)
    } catch (error) {
        throw new Error(error)
    }
}

const general_inventory_report_detailed = async (family_id) => {
    const family = await Family.findById(family_id)
    const packings = await Packing.find({ family: family._id }).populate('last_event_record')
    const data = await Promise.all(
        packings
            .filter(packing => packing.last_event_record && packing.last_event_record.type === 'inbound')
            .map(async packing => {
                let data_temp = {}

                const control_point = await ControlPoint.findById(packing.last_event_record.control_point)

                data_temp.packing = packing._id
                data_temp.control_point_name = control_point.name

                return data_temp
            })
    )

    return data
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