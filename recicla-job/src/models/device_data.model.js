const debug = require('debug')('model:device_data')
const mongoose = require('mongoose')

const deviceDataSchema = new mongoose.Schema({
    device_id: {
        type: String,
        required: true
    },
    message_date: {
        type: Date
    },
    message_date_timestamp: {
        type: Date
    },
    last_communication: {
        type: Date
    },
    last_communication_timestamp: {
        type: Date
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
        }
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

const update_updated_at_middleware = function (next) {
    this.update_at = Date.now
    next()
}

deviceDataSchema.pre('update', update_updated_at_middleware)
deviceDataSchema.pre('findOneAndUpdate', update_updated_at_middleware)

const DeviceData = mongoose.model('DeviceData', deviceDataSchema)

exports.DeviceData = DeviceData
exports.deviceDataSchema = deviceDataSchema