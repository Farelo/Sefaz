const debug = require('debug')('model:types')
const mongoose = require('mongoose')
const Joi = require('joi')

const typeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true
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
const validate_types = (type) => {
    const schema = Joi.object().keys({
        name: Joi.string().min(5).max(50).required()
    })

    return Joi.validate(type, schema, { abortEarly: false })
}

typeSchema.statics.findByName = function (name, projection = '') {
    return this.findOne({ name }, projection)
}

const update_updated_at_middleware = function (next) {
    this.update_at = Date.now
    next()
}

typeSchema.pre('update', update_updated_at_middleware)
typeSchema.pre('findOneAndUpdate', update_updated_at_middleware)

const Type = mongoose.model('Type', typeSchema)

exports.Type = Type
exports.typeSchema = typeSchema
exports.validate_types = validate_types