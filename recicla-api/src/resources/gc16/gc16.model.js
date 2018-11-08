const debug = require('debug')('model:types')
const mongoose = require('mongoose')
const Joi = require('joi')

const { Family } = require('../families/families.model')

const gc16Schema = new mongoose.Schema({
    annual_volume: Number,
    capacity: Number,
    productive_days: Number,
    container_days: Number,
    family: {
        type: mongoose.Schema.ObjectId,
        ref: 'Family',
        required: true,
        unique: true
    },
    security_factor: {
        percentage: Number,
        qty_total_build: Number,
        qty_container: Number
    },
    frequency: {
        days: Number,
        fr: Number,
        qty_total_days: Number,
        qty_container: Number
    },
    transportation_going: {
        days: Number,
        value: Number,
        qty_container: Number
    },
    transportation_back: {
        days: Number,
        value: Number,
        qty_container: Number
    },
    stock: {
        days: Number,
        value: Number,
        max: Number,
        qty_container: Number,
        qty_container_max: Number
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

const validate_gc16 = (gc16) => {
    const schema = Joi.object().keys({
        annual_volume: Joi.number().max(10000),
        capacity: Joi.number().max(10000),
        productive_days: Joi.number().max(10000),
        container_days: Joi.number().max(10000),
        capacity: Joi.number().max(10000),
        family: Joi.objectId().required(),
        security_factor: {
            percentage: Joi.number().max(10000),
            qty_total_build: Joi.number().max(10000),
            qty_container: Joi.number().max(10000)
        },
        frequency: {
            days: Joi.number().max(10000),
            fr: Joi.number().max(10000),
            qty_total_days: Joi.number().max(10000),
            qty_container: Joi.number().max(10000)
        },
        transportation_going: {
            days: Joi.number().max(10000),
            value: Joi.number().max(10000),
            qty_container: Joi.number().max(10000)
        },
        transportation_back: {
            days: Joi.number().max(10000),
            value: Joi.number().max(10000),
            qty_container: Joi.number().max(10000)
        },
        stock: {
            days: Joi.number().max(10000),
            value: Joi.number().max(10000),
            max: Joi.number().max(10000),
            qty_container: Joi.number().max(10000),
            qty_container_max: Joi.number().max(10000)
        }
    })

    return Joi.validate(gc16, schema, { abortEarly: false })
}

const update_family = async (gc16, next) => {
    try {
        await Family.findOneAndUpdate({ _id: gc16.family }, { gc16: gc16._id }, { new: true })
    } catch (error) {
        next(error)
    }
}

gc16Schema.statics.findByName = function (name, projection = '') {
    return this.findOne({ name }, projection)
}

const save_middleware = function (doc, next) {
    update_family(doc, next)
}

const update_updated_at_middleware = function (next) {
    let update = this.getUpdate()
    update.update_at = new Date()
    next()
}

gc16Schema.post('save', save_middleware)
gc16Schema.pre('update', update_updated_at_middleware)
gc16Schema.pre('findOneAndUpdate', update_updated_at_middleware)

const GC16 = mongoose.model('GC16', gc16Schema)

exports.GC16 = GC16
exports.gc16Schema = gc16Schema
exports.validate_gc16 = validate_gc16