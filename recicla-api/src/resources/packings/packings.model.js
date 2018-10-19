const mongoose = require('mongoose')

// TODO: Adicionar os atributos: { gc16, last_device_data,  } 
const packingSchema = new mongoose.Schema({
    tag: {
        code: {
            type: String,
            required: true
        },
        version: String,
        manufactorer: String
    },
    serial: {
        type: String,
        required: true,
    },
    type: String,
    weigth: Number,
    width: Number,
    heigth: Number,
    length: Number,
    capacity: Number,
    temperature: Number,
    observations: String,
    active: Boolean,
    absent: Boolean,
    low_battery: Boolean,
    family: {
        type: mongoose.Schema.ObjectId,
        ref: 'Family'
    }
})

packingSchema.statics.findByTag = function (code, projection = '') {
    return this.findOne({ code }, projection)
}

const Packing = mongoose.model('Packing', packingSchema)

exports.Packing = Packing
exports.packingSchema = packingSchema