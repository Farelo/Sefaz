const debug = require('debug')('model:packings')
const mongoose = require('mongoose')
const Joi = require('joi')

// TODO: Adicionar os atributos: { gc16, last_device_data,  } 
const packingSchema = new mongoose.Schema({
    tag: {
        code: {
            type: String,
            minlength: 4,
            maxlength: 25,
            required: true
        },
        version: {
            type: String,
            minlength: 2,
            maxlength: 30,
        },
        manufactorer: {
            type: String,
            minlength: 2,
            maxlength: 30,
        }
    },
    serial: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true
    },
    type: {
        type: String,
        minlength: 2,
        maxlength: 30,
    },
    weigth: {
        type: Number,
        max: 10000,
        default: 0
    },
    width: {
        type: Number,
        max: 10000,
        default: 0
    },
    heigth: {
        type: Number,
        max: 10000,
        default: 0
    },
    length: {
        type: Number,
        max: 10000,
        default: 0
    },
    capacity: {
        type: Number,
        max: 10000,
        default: 0
    },
    temperature: {
        type: Number,
        max: 1000,
        default: 0
    },
    observations: {
        type: String,
        maxlength: 250,
    },
    active: {
        type: Boolean,
        default: false
    },
    absent: {
        type: Boolean,
        default: false
    },
    low_battery: {
        type: Boolean,
        default: false
    },
    family: {
        type: mongoose.Schema.ObjectId,
        ref: 'Family',
        required: true
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

const validate_packings = (packing) => {
    const schema = Joi.object().keys({
        tag: {
            code: Joi.string().min(4).max(25).required(),
            version: Joi.string().min(2).max(30),
            manufactorer: Joi.string().min(2).max(30)
        },
        serial: Joi.string().min(2).max(30).required(),
        type: Joi.string().min(2).max(30),
        weigth: Joi.number().max(10000),
        width: Joi.number().max(10000),
        heigth: Joi.number().max(10000),
        length: Joi.number().max(10000),
        capacity: Joi.number().max(10000),
        observations: Joi.string().max(250),
        active: Joi.boolean(),
        family: Joi.objectId().required()
    })

    return Joi.validate(packing, schema, { abortEarly: false })
}

packingSchema.statics.findByTag = function (tag, projection = '') {
    return this.findOne({ 'tag.code': tag.code }, projection)
}

const update_updated_at_middleware = function (next) {
    this.update_at = Date.now
    next()
}

packingSchema.pre('update', update_updated_at_middleware)
packingSchema.pre('findOneAndUpdate', update_updated_at_middleware)

const Packing = mongoose.model('Packing', packingSchema)

exports.Packing = Packing
exports.packingSchema = packingSchema
exports.validate_packings = validate_packings