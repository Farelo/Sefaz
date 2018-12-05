const debug = require('debug')('service:device_data')
// const _ = require('lodash')
const { DeviceData } = require('./device_data.model')
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