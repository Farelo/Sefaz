const debug = require('debug')('service:packings')
const _ = require('lodash')
const config = require('config')
const { Packing } = require('./packings.model')
const { Family } = require('../families/families.model')
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

        // console.log(query)
        
        if (query.company_id !== null) {
            familiesIds = await (await Family.find({ company: query.company_id })).map(f => f._id)
        } else if (query.family_id !== null) {
            familiesIds.push(new mongoose.Types.ObjectId(query.family_id))
        }

        let conditions = {};

        if (familiesIds.length) {
            conditions['family'] = {
                '$in': familiesIds
            }
        }

        if (query.packing_serial !== null) {
            conditions['serial'] = {
                '$eq': query.packing_serial
            }
        }
        
        // console.log(conditions)
        return await Packing.find(conditions).populate('last_device_data').populate('last_device_data_battery').populate('family', ['_id', 'code'])
        
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