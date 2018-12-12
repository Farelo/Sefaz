const debug = require('debug')('model:types')
const mongoose = require('mongoose')
const Joi = require('joi')

const { ControlPoint } = require('../control_points/control_points.model')

const gc16Schema = new mongoose.Schema({
    annual_volume: {
        type: Number,
        default: 0
    },
    capacity: {
        type: Number,
        default: 0
    },
    productive_days: {
        type: Number,
        default: 0
    },
    container_days: {
        type: Number,
        default: 0
    },
    control_point: {
        type: mongoose.Schema.ObjectId,
        ref: 'ControlPoint',
        required: true,
        unique: true
    },
    security_factor: {
        percentage: {
            type: Number,
            default: 0
        },
        qty_total_build: {
            type: Number,
            default: 0
        },
        qty_container: {
            type: Number,
            default: 0
        }
    },
    frequency: {
        days: {
            type: Number,
            default: 0
        },
        fr: {
            type: Number,
            default: 0
        },
        qty_total_days: {
            type: Number,
            default: 0
        },
        qty_container: {
            type: Number,
            default: 0
        }
    },
    transportation_going: {
        days: {
            type: Number,
            default: 0
        },
        value: {
            type: Number,
            default: 0
        },
        qty_container: {
            type: Number,
            default: 0
        }
    },
    transportation_back: {
        days: {
            type: Number,
            default: 0
        },
        value: {
            type: Number,
            default: 0
        },
        qty_container: {
            type: Number,
            default: 0
        }
    },
    owner_stock: {
        days: {
            type: Number,
            default: 0
        },
        value: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 0
        },
        qty_container: {
            type: Number,
            default: 0
        },
        qty_container_max: {
            type: Number,
            default: 0
        }
    },
    client_stock: {
        days: {
            type: Number,
            default: 0
        },
        value: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 0
        },
        qty_container: {
            type: Number,
            default: 0
        },
        qty_container_max: {
            type: Number,
            default: 0
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

const validate_gc16 = (gc16) => {
    const schema = Joi.object().keys({
        annual_volume: Joi.number().min(0).max(1000000),
        capacity: Joi.number().min(0).max(10000),
        productive_days: Joi.number().min(0).max(10000),
        container_days: Joi.number().min(0).max(10000),
        capacity: Joi.number().min(0).max(10000),
        control_point: Joi.objectId().required(),
        security_factor: {
            percentage: Joi.number().min(0).max(10000),
            qty_total_build: Joi.number().min(0).max(10000),
            qty_container: Joi.number().min(0).max(10000)
        },
        frequency: {
            days: Joi.number().min(0).max(10000),
            fr: Joi.number().min(0).max(10000),
            qty_total_days: Joi.number().min(0).max(10000),
            qty_container: Joi.number().min(0).max(10000)
        },
        transportation_going: {
            days: Joi.number().min(0).max(10000),
            value: Joi.number().min(0).max(10000),
            qty_container: Joi.number().min(0).max(10000)
        },
        transportation_back: {
            days: Joi.number().min(0).max(10000),
            value: Joi.number().max(10000),
            qty_container: Joi.number().min(0).max(10000)
        },
        owner_stock: {
            days: Joi.number().min(0).max(10000),
            value: Joi.number().min(0).max(10000),
            max: Joi.number().min(0).max(10000),
            qty_container: Joi.number().min(0).max(10000),
            qty_container_max: Joi.number().min(0).max(10000)
        },
        client_stock: {
            days: Joi.number().min(0).max(10000),
            value: Joi.number().min(0).max(10000),
            max: Joi.number().min(0).max(10000),
            qty_container: Joi.number().min(0).max(10000),
            qty_container_max: Joi.number().min(0).max(10000)
        }
    })

    return Joi.validate(gc16, schema, { abortEarly: false })
}

const update_control_point = async (gc16, next) => {
    try {
        const control_point = await ControlPoint.findById(gc16.control_point)
        if (!control_point) return null

        await ControlPoint.findByIdAndUpdate(gc16.control_point, { gc16: gc16._id }, { new: true })
        next()
    } catch (error) {
        next(error)
    }
}

const unset_gc16_in_control_point = async (gc16, next) => {
    try {
        const control_point = await ControlPoint.findById(gc16.control_point)
        if (!control_point) return null

        await ControlPoint.findByIdAndUpdate(gc16.control_point, { $unset: { gc16: gc16._id } })
        next()
    } catch (error) {
        next(error)
    }
}

const save_middleware = function (doc, next) {
    update_control_point(doc, next)
}

const update_updated_at_middleware = function (next) {
    let update = this.getUpdate()
    update.update_at = new Date()
    next()
}

const remove_middelware = function (next) {
    unset_gc16_in_control_point(this, next)
}

gc16Schema.post('save', save_middleware)
gc16Schema.pre('update', update_updated_at_middleware)
gc16Schema.pre('findOneAndUpdate', update_updated_at_middleware)
gc16Schema.post('findOneAndUpdate', save_middleware)
gc16Schema.pre('remove', remove_middelware)

const GC16 = mongoose.model('GC16', gc16Schema)

exports.GC16 = GC16
exports.gc16Schema = gc16Schema
exports.validate_gc16 = validate_gc16