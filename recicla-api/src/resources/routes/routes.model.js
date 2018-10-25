const debug = require('debug')('model:routes')
const mongoose = require('mongoose')
const Joi = require('joi')

const routeSchema = new mongoose.Schema({
    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Family',
        required: true
    },
    first_point: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ControlPoint',
        required: true
    },
    second_point: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ControlPoint',
        required: true
    },
    distance: {
        type: Number
    },
    duration: {
        type: Number
    },
    traveling_time: {
        max: Number,
        min: Number
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
const validate_routes = (route) => {
    const schema = Joi.object().keys({
        first_point: Joi.objectId().required(),
        second_point: Joi.objectId().required(),
        family: Joi.objectId().required(),
        distance: Joi.number(),
        duration: Joi.number(),
        traveling_time: {
            max: Joi.number(),
            min: Joi.number()
        }
    })

    return Joi.validate(route, schema, { abortEarly: false })
}

const update_updated_at_middleware = function (next) {
    this.update_at = Date.now
    next()
}

routeSchema.pre('update', update_updated_at_middleware)
routeSchema.pre('findOneAndUpdate', update_updated_at_middleware)

const Route = mongoose.model('Route', routeSchema)

exports.Route = Route
exports.routeSchema = routeSchema
exports.validate_routes = validate_routes