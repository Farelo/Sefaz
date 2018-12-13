const debug = require('debug')('model:device_data')
const mongoose = require('mongoose')
const { Packing } = require('./packings.model')

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

        let current_message_date_on_packing = await DeviceData.findById(packing.last_device_data, {_id: 0, message_date: 1})

        current_message_date_on_packing = current_message_date_on_packing ? current_message_date_on_packing.message_date : null

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

const device_data_save = async (devide_data_array) => {
    for (device_data of devide_data_array) {

            try {
                const new_device_data = new DeviceData({
                    device_id: device_data.deviceId.toString(),
                    message_date: new Date(device_data.messageDate),
                    message_date_timestamp: device_data.messageDateTimestamp,
                    last_communication: new Date(device_data.lastCommunication),
                    last_communication_timestamp: device_data.lastCommunicationTimestamp,
                    latitude: device_data.latitude,
                    longitude: device_data.longitude,
                    accuracy: device_data.accuracy,
                    temperature: device_data.temperature,
                    seq_number: device_data.seqNumber,
                    battery: {
                        percentage: device_data.battery.percentage,
                        voltage: device_data.battery.voltage
                    }
                })

                //salva no banco | observação: não salva mensagens iguais porque o model possui indice unico e composto por device_id e message_date,
                //e o erro de duplicidade nao interrompe o job
                await new_device_data.save( )
    
                // debug('Saved device_data ', device_data.deviceId, ' and message_date ', device_data.messageDate)
    
            } catch (error) {
                debug('Erro ao salvar o device_data do device  ', device_data.deviceId, ' para a data-hora ', device_data.messageDate, ' | System Error ', error.errmsg ? error.errmsg : error.errors)
            }
    }
}

deviceDataSchema.post('save', saveDeviceDataToPacking)
deviceDataSchema.pre('update', update_updated_at_middleware)
deviceDataSchema.pre('findOneAndUpdate', update_updated_at_middleware)

const DeviceData = mongoose.model('DeviceData', deviceDataSchema)

exports.DeviceData = DeviceData
exports.deviceDataSchema = deviceDataSchema
exports.device_data_save = device_data_save