const debug = require('debug')('model:routes')
const mongoose = require('mongoose')

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
        type: Number,
        default: 0
    },
    duration_time: {
        type: Number,
        default: 0
    },
    traveling_time: {
        max: {
            type: Number,
            default: 0
        },
        min: {
            type: Number,
            default: 0
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