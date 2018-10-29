const debug = require('debug')('model:control_points')
const mongoose = require('mongoose')

const controlPointSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true
    },
    duns: {
        type: String,
        minlength: 2,
        maxlength: 50,
    },
    lat: {
        type: Number,
        min: -90,
        max: 90,
        default: 0
    },
    lng: {
        type: Number,
        min: -180,
        max: 180,
        default: 0
    },
    full_address: {
        type: String,
        minlength: 5,
        maxlength: 100
    },
    type: {
        type: String,
        required: true,
        enum: ['factory', 'supplier', 'logistic_op', 'others'],
        lowercase: true,
        default: 'others',
        trim: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
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

controlPointSchema.statics.findByName = function (name, projection = '') {
    return this.findOne({ name }, projection)
}

const update_updated_at_middleware = function (next) {
    this.update_at = Date.now
    next()
}

controlPointSchema.pre('update', update_updated_at_middleware)
controlPointSchema.pre('findOneAndUpdate', update_updated_at_middleware)

const ControlPoint = mongoose.model('ControlPoint', controlPointSchema)

exports.ControlPoint = ControlPoint
exports.controlPointSchema = controlPointSchema