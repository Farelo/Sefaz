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

exports.get_device_data = async (device_id, query = { start_date: null, end_date: null, accuracy: null }) => {
    try {
        let device_data = []
        switch (true) {
            case query.start_date != null && query.end_date != null:
                device_data = await DeviceData
                    .find({ device_id: device_id, message_date: { $gte: new Date(query.start_date), $lte: new Date(query.end_date) }, accuracy: { $lte: query.accuracy } })
                    .sort({ message_date: -1 })
                    .limit(50)
                break
            case query.start_date!= null:
                device_data = await DeviceData
                    .find({ device_id, message_date: { $gte: new Date(query.start_date) }, accuracy: { $lte: query.accuracy } })
                    .sort({ message_date: -1 })
                    .limit(50)
                break
            case query.end_date!= null:
                device_data = await DeviceData
                    .find({ device_id, message_date: { $lte: new Date(query.end_date) }, accuracy: { $lte: query.accuracy } })
                    .sort({ message_date: -1 })
                    .limit(50)
                break
            default:
                device_data = await DeviceData
                    .find({ device_id, accuracy: { $lte: query.accuracy }})
                    .sort({ message_date: -1 })
                break
        }

        return device_data
    } catch (error) {
        throw new Error(error)
    }
}

exports.geolocation = async (query = { company_id: null, family_id: null, packing_serial: null }) => {
    try {
        let packings = []

        switch (true) {
            case query.company_id != null:
                const families = await Family.find({ company: query.company_id })
                const data = await Promise.all(
                    families.map(async family => {
                        return await Packing.find({ family: family._id }).populate('last_device_data')
                    })
                )
                packings = _.flatMap(data)
                break
            case query.family_id != null:
                packings = await Packing
                    .find({ family: query.family_id }).populate('last_device_data')
                break
            case query.packing_serial != null:
                packings = await Packing
                    .findOne({ serial: query.packing_serial }).populate('last_device_data')
                break
            default:
                packings = await Packing.find({}).populate('last_device_data')
                break
        }

        return packings
    } catch (error) {
        throw new Error(error)
    }
}