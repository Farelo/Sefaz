const debug = require('debug')('model:device_data')
const mongoose = require('mongoose')
const { Packing } = require('../packings/packings.model')

const deviceDataSchema = new mongoose.Schema({
    device_id: {
        type: String,
        required: true
    },
    message_date: {
        type: Date,
        required: true
    },
    message_date_timestamp: {
        type: Number,
        required: true
    },
    last_communication: {
        type: Date
    },
    last_communication_timestamp: {
        type: Number
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    accuracy: {
        type: Number
    },
    temperature: {
        type: Number
    },
    seq_number: {
        type: Number
    },
    battery: {
        percentage: {
            type: Number
        },
        voltage: {
            type: Number
        },
    },
    created_at: {
        type: Date,
        default: Date.now

    },
    update_at: {
        type: Date,
        default: Date.now
    }
})


deviceDataSchema.index({ device_id: 1, message_date: -1 }, { unique: true })

const update_packing = async (device_data, next) => {
    try {
        const tag = { code: device_data.device_id }
        const packing = await Packing.findByTag(tag)
        
        if (!packing) next()

        const current_message_date_on_packing = await DeviceData.findById(packing.last_device_data, {_id: 0, message_date: 1})

        await Packing.findByIdAndUpdate(packing._id, { last_device_data: device_data.message_date > current_message_date_on_packing ? device_data._id : packing.last_device_data }, { new: true })
        
        next()
    } catch (error) {
        next(error)
    }
}

deviceDataSchema.statics.findByDeviceId = function (device_id, projection = '') {
    return this.findOne({ device_id }, projection)
}

const saveDeviceDataToPacking = function (doc, next) {
    update_packing(doc, next)
}

const update_updated_at_middleware = function (next) {
    let update = this.getUpdate()
    update.update_at = new Date()
    next()
}

deviceDataSchema.post('save', saveDeviceDataToPacking)
deviceDataSchema.pre('update', update_updated_at_middleware)
deviceDataSchema.pre('findOneAndUpdate', update_updated_at_middleware)

const DeviceData = mongoose.model('DeviceData', deviceDataSchema)

exports.DeviceData = DeviceData
exports.deviceDataSchema = deviceDataSchema
// exports.validate_device_data = validate_device_data
