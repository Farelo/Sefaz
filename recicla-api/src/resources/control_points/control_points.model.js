const debug = require('debug')('model:control_points')
const mongoose = require('mongoose')
const Joi = require('joi')

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
        minlength: 5,
        maxlength: 50,
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    },
    full_address: {
        type: String
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
const validate_control_points = (control_point) => {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        duns: Joi.string(),
        lat: Joi.number(),
        lng: Joi.number(),
        type: Joi.string(),
        company: Joi.objectId()
    })

    return Joi.validate(control_point, schema, { abortEarly: false })
}


packingSchema.statics.findByName = function (name, projection = '') {
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
exports.validate_control_points = validate_control_points