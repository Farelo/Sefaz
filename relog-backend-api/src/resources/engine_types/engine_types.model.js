const mongoose = require('mongoose')
const Joi = require('joi')

const engine_typeSchema = new mongoose.Schema({
    code: {
        type: String,
        minlength: 2,
        maxlength: 50,
        required: true,
        unique: true
    },
    
    observations: {
        type: String,
        minlength: 0,
        maxlength: 250,
    }
    
})

const validate_engine_types = (engine_type) => {
    const schema = Joi.object().keys({
        code: Joi.string().min(2).max(50).required(),
        observations: Joi.string().min(2).max(50)
    })

    return Joi.validate(engine_type, schema, { abortEarly: false })
}

engine_typeSchema.statics.findByCode = function (code, projection = '') {
    return this.findOne({ code }, projection)
}

const update_updated_at_middleware = function (next) {
    let update = this.getUpdate()
    update.update_at = new Date()
    next()
}

engine_typeSchema.pre('update', update_updated_at_middleware)
engine_typeSchema.pre('findOneAndUpdate', update_updated_at_middleware)

const Engine_type = mongoose.model('Engine_type', engine_typeSchema)

exports.Engine_type = Engine_type
exports.engine_typeSchema = engine_typeSchema
exports.validate_engine_types = validate_engine_types