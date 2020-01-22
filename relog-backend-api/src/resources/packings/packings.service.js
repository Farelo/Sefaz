const debug = require('debug')('service:packings')
const _ = require('lodash')
const config = require('config')
const { Packing } = require('./packings.model')
const { Family } = require('../families/families.model')
const { Company } = require('../companies/companies.model')
const { ControlPoint } = require('../control_points/control_points.model')
const event_record_service = require('../event_record/event_record.service')
const rp = require('request-promise')
const mongoose = require('mongoose')

exports.get_packings = async (tag, family) => {
    try {
        if (!tag) {
            if (family) return await Packing.find({ family: family })
                .populate('family', ['_id', 'code', 'company'])
                .populate('project', ['_id', 'name'])
                
            return await Packing.find()
                .populate('family', ['_id', 'code', 'company'])
                .populate('project', ['_id', 'name'])
        }
        
        const data = await Packing.findByTag(tag)
                            .populate('family', ['_id', 'code', 'company'])
                            .populate('project', ['_id', 'name'])
                            .populate('last_device_data')
                            .populate('last_device_data_battery')
                            .populate('last_event_record')
                            .populate('last_alert_history')

        return data ? [data] : []

    } catch (error) {
        throw new Error(error)
    }
}

exports.get_packing = async (id) => {
    try {
        const packing = await Packing
            .findById(id)
            .populate('family', ['_id', 'code', 'company'])
            .populate('project', ['_id', 'name'])
            .populate('last_device_data')
            .populate('last_device_data_battery')
            .populate('last_event_record')
            .populate('last_alert_history')
            
        
        return packing
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_tag = async (tag) => {
    try {
        const packing = await Packing.findByTag(tag)
                .populate('family', ['_id', 'code', 'company'])
                .populate('project', ['_id', 'name'])

        return packing
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_serial = async (serial) => {
    try {
        const packings = await Packing.find({ serial })

        return packings
    } catch (error) {
        throw new Error(error)
    }
}

exports.create_packing = async (packing) => {
    try {
        const new_packing = new Packing(packing)
        await new_packing.save()

        return new_packing
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_id = async (id) => {
    try {
        const packing = await Packing.findById(id)
            .populate('family', ['_id', 'code', 'company'])
            .populate('project', ['_id', 'name'])

        return packing
    } catch (error) {
        throw new Error(error)
    }
}

exports.update_packing = async (id, packing_edited) => {
    try {
        const options = { runValidators: true, new: true }
        const packing = await Packing.findByIdAndUpdate(id, packing_edited, options)

        return packing
    } catch (error) {
        throw new Error(error)
    }
}

exports.get_packings_on_control_point = async (control_point) => {
    try {
        const packings = await Packing.find({}).populate('last_event_record').populate('family', ['_id', 'code'])

        const data = packings.filter(packing => packingOnControlPoint(packing, control_point))

        return data
    } catch (error) {
        throw new Error(error)
    }
}

exports.check_device = async (device_id) => {
    try {
        const cookie = await loginLokaDmApi()
        const response = await deviceById(cookie, device_id)

        return response
    } catch (error) {
        debug(error)
        throw new Error(error)
    }
}

exports.geolocation = async (query = { company_id: null, family_id: null, packing_serial: null }) => {
    try {
        let familiesIds = []

        if (query.company_id != null) {
            familiesIds = await (await Family.find({ company: query.company_id })).map(f => f._id)
        } else if (query.family_id != null) {
            familiesIds.push(new mongoose.Types.ObjectId(query.family_id))
        }

        let conditions = {};

        if (familiesIds.length) {
            conditions['family'] = {
                $in: familiesIds
            }
        }

        if (query.packing_serial != null) {
            conditions['serial'] = {
                $eq: query.packing_serial
            }
        }
        
        return await Packing.find(conditions).populate('last_device_data').populate('last_device_data_battery').populate('family')
        
    } catch (error) {
        throw new Error(error)
    }
}

exports.control_point_geolocation = async (query) => {
    try {
        let date_conditions = {}
        if ((query.start_date != null && query.end_date)) {

            date_conditions = {
                $gte: new Date(query.start_date),
                $lte: new Date(query.end_date),
            }

        } else if (query.date != null) {

            date_conditions = {
                $gte: new Date(query.date),
                $lt: new Date(date2.setDate(query.date + 1)),
            }

        } else if (query.last_hours) {
            let date = new Date()
            date.setHours(date.getHours() - query.last_hours)
            
            date_conditions = {
                $gte: date
            }
        }
        
        let event_record_conditions = {
            type: 'inbound'
        }

        if (query.company_id != null || query.company_type != null) {
            let company_conditions = {}
            if (query.company_id != null) {
                company_conditions = { _id: query.company_id }            
            } else if (query.company_type != null) {
                company_conditions = { type: query.company_type }            
            }
            let companies_ids = await Company.find(company_conditions).distinct('_id')
            
            let control_point_conditions = {}
            if (query.control_point_id != null) {
                control_point_conditions = { _id: query.control_point_id }            
            } else if (query.control_point_type != null) {
                control_point_conditions = { type: query.control_point_type }            
            }
            control_point_conditions['company'] = { $in: companies_ids }
            let control_points = await ControlPoint.find(control_point_conditions).distinct('_id')

            event_record_conditions = { control_point: { $in: control_points } }
        }

        if (!_.isEmpty(date_conditions)) {
            event_record_conditions['created_at'] = date_conditions
        }

        let event_records = await event_record_service.find_by_control_point_and_date(event_record_conditions)

        if (query.family_id != null || query.serial != null) {
            event_records = event_records.filter(er => {
                if (query.family_id != null && query.serial != null) {
                    if (er.packing.family == query.family_id && er.packing.serial == query.serial) {
                        return true
                    }
                } else if (query.family_id != null) {
                    if (er.packing.family == query.family_id) {
                        return true
                    }
                } else {
                    if (er.packing.serial == query.serial) {
                        return true
                    }
                }
                return false
            })
        }

        return event_records
        
    } catch (error) {
        throw new Error(error)
    }
}

const packingOnControlPoint = (packing, control_point) => {
    return packing.last_event_record && packing.last_event_record.type === 'inbound' ? packing.last_event_record.control_point.toString() === control_point._id.toString() : false
}

const loginLokaDmApi = async () => {
    const options = {
        method: 'POST',
        uri: `${config.get('loka_api.baseUrl')}/auth/login`,
        headers: {
            'Content-type': 'application/json'
        },
        body: {
            username: config.get('loka_api.username'),
            password: config.get('loka_api.password')
        },
        resolveWithFullResponse: true,
        json: true
    }

    try {
        const response = await rp(options)
        const cookie = response.headers['set-cookie'][0].split(';')[0]

        return cookie
    } catch (error) {
        throw new Error(error)
    }
}

const deviceById = async (cookie, device_id) => {
    try {
        const options = {
            method: 'GET',
            uri: `${config.get('loka_api.baseUrl')}/terminal/get/${device_id}`,
            headers: {
                'content-type': 'application/json',
                'Cookie': `${cookie}`,
                'Connection': 'close'
            },
            json: true
        }

        const body = await rp(options)
        return  body
    } catch (error) {
        throw new Error(error)
    }
}