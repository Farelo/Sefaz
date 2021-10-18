const debug = require('debug')('model:engine_types')
const mongoose = require('mongoose')
const Joi = require('joi')

const engineTypeSchema = new mongoose.Schema({
    code: {
        type: String,
        minlength: 4,
        maxlength: 50,
        required: true,
        unique: true
    },
    
    observations: {
        type: String,
        minlength: 0,
        maxlength: 250,
        required: true
    }
    
})

const validate_engineTypes = (engine_type) => {
    const schema = Joi.object().keys({
        code: Joi.string().min(4).max(50).required(),
        observations: Joi.string().min(0).max(250).required().allow('')
        
    })

    return Joi.validate(engine_type, schema, { abortEarly: false })
}

engineTypeSchema.statics.findByCode = function (code, projection = '') {
    return this.findOne({ code }, projection)
}

const update_updated_at_middleware = function (next) {
    let update = this.getUpdate()
    update.update_at = new Date()
    next()
}

engineTypeSchema.pre('update', update_updated_at_middleware)
engineTypeSchema.pre('findOneAndUpdate', update_updated_at_middleware)

const EngineType = mongoose.model('EngineType', engineTypeSchema)

exports.EngineType = EngineType
exports.engineTypeSchema = engineTypeSchema
exports.validate_engineTypes = validate_engineTypes