const debug = require('debug')('model:integrations')
const mongoose = require('mongoose')
const Joi = require('joi')

const integrationSchema = new mongoose.Schema({
    tag: {
        code: {
            type: String,
            minlength: 4,
            maxlength: 25,
            required: true
        },
    },

    id_engine_type: {
        type: mongoose.Schema.ObjectId,
        ref: 'EngineType',
        required: true
    },

    serial: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true
    },

    dtVinculo:{
        type: Date,
    },

    family: {
        type: mongoose.Schema.ObjectId,
        ref: 'Family',
        required: true
    },
    
    id_rack: {
        type: mongoose.Schema.ObjectId,
        ref: 'Rack',
        required: true
    },
    
    active: {
        type: Boolean,
        default: false
    },
    
})

const validate_integrations = (integration) => {
    const schema = Joi.object().keys({
        tag: {
            code: Joi.string().min(4).max(25).required(),
        },
        id_engine_type: Joi.objectId().required(),
        serial: Joi.string().min(2).max(30).required(),
        production_date: Joi.date(),
        family: Joi.objectId().required(),
        id_rack: Joi.objectId().required(),
        active: Joi.boolean()
    })

    return Joi.validate(integration, schema, { abortEarly: false })
}

integrationSchema.statics.findByTag = function (tag, projection = '') {
    return this.findOne({ 'tag.code': tag }, projection)
}

const update_updated_at_middleware = function (next) {
    let update = this.getUpdate()
    update.update_at = new Date()
    next()
}

integrationSchema.pre('update', update_updated_at_middleware)
integrationSchema.pre('findOneAndUpdate', update_updated_at_middleware)

const Integration = mongoose.model('Integration', integrationSchema)

exports.Integration = Integration
exports.integrationSchema = integrationSchema
exports.validate_integrations = validate_integrations