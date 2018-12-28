const debug = require('debug')('service:device_data')
const _ = require('lodash')
const { DeviceData } = require('./device_data.model')
const { Family } = require('../families/families.model')
const { Packing } = require('../packings/packings.model')

exports.find_packing_by_device_id = async (device_id) => {
    try {
        const tag = { code: device_id }
        const packing = await Packing.findByTag(tag)

        return packing
    } catch (error) {
        throw new Error(error)
    }
}

exports.get_device_data = async (device_id, {start_date = null, end_date = null, accuracy = null, max = null}) => {
    let device_data = []
    let conditions = {}
    let projection = {}
    let options = {}

    conditions.device_id = device_id
    options.sort = {message_date: -1}

    try {
        if (start_date && end_date)
            conditions.message_date = { $gte: new Date(start_date), $lte: new Date(end_date)}
        else if (start_date)
            conditions.message_date = { $gte: new Date(start_date)}
        else if (end_date)
            conditions.message_date = { $lte: new Date(end_date)}

        if(accuracy)
            conditions.accuracy = { $lte: accuracy }
        
        if (max)
            options.limit = parseInt(max)

        device_data = await DeviceData.find(conditions, projection, options)

        return device_data
    } catch (error) {
        throw new Error(error)
    }
}

exports.geolocation = async (query = { company_id: null, family_id: null, packing_serial: null }) => {
    try {
        let packings = []
        let families = []
        let data = []

        switch (true) {
            case query.company_id != null && query.family_id != null && query.packing_serial != null:
                families = await Family.find({ _id: query.family_id })
                data = await Promise.all(
                    families.map(async family => {
                        return await Packing.find({ family: family._id, serial: query.packing_serial }).populate('last_device_data').populate('last_device_data_battery').populate('family')
                    })
                )
                packings = _.flatMap(data)
                break
            case query.company_id != null && query.family_id != null:
                families = await Family.find({ _id: query.family_id })
                data = await Promise.all(
                    families.map(async family => {
                        return await Packing.find({ family: family._id }).populate('last_device_data').populate('last_device_data_battery').populate('family')
                    })
                )
                packings = _.flatMap(data)
                break
            case query.company_id != null && query.packing_serial != null:
                families = await Family.find({ company: query.company_id })
                data = await Promise.all(
                    families.map(async family => {
                        return await Packing.find({ family: family._id, serial: query.packing_serial }).populate('last_device_data').populate('last_device_data_battery').populate('family')
                    })
                )
                packings = _.flatMap(data)
                break
            case query.family_id != null && query.packing_serial != null:
                packings = await Packing
                    .find({ family: query.family_id, serial: query.packing_serial }).populate('last_device_data').populate('last_device_data_battery').populate('family')
                break
            case query.company_id != null:
                families = await Family.find({ company: query.company_id })
                data = await Promise.all(
                    families.map(async family => {
                        return await Packing.find({ family: family._id }).populate('last_device_data').populate('last_device_data_battery').populate('family')
                    })
                )
                packings = _.flatMap(data)
                break
            case query.family_id != null:
                packings = await Packing
                    .find({ family: query.family_id }).populate('last_device_data').populate('last_device_data_battery').populate('family')
                break
            case query.packing_serial != null:
                packings = await Packing
                    .find({ serial: query.packing_serial }).populate('last_device_data').populate('last_device_data_battery').populate('family')
                break
            default:
                packings = await Packing.find({}).populate('last_device_data').populate('last_device_data_battery').populate('family')
                break
        }

        return packings
    } catch (error) {
        throw new Error(error)
    }
}

