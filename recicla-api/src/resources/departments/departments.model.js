const debug = require('debug')('model:departments')
const mongoose = require('mongoose')
const Joi = require('joi')

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true
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
    control_point: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ControlPoint',
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
const validate_departments = (department) => {
    const schema = Joi.object().keys({
        name: Joi.string().min(5).max(50).required(),
        lat: Joi.number().min(-90).max(90),
        lng: Joi.number().min(-180).max(180),
        control_point: Joi.objectId().required()
    })

    return Joi.validate(department, schema, { abortEarly: false })
}

departmentSchema.statics.findByName = function (name, projection = '') {
    return this.findOne({ name }, projection)
}

const update_updated_at_middleware = function (next) {
    this.update_at = Date.now
    next()
}

departmentSchema.pre('update', update_updated_at_middleware)
departmentSchema.pre('findOneAndUpdate', update_updated_at_middleware)

const Department = mongoose.model('Department', departmentSchema)

exports.Department = Department
exports.departmentSchema = departmentSchema
exports.validate_departments = validate_departments