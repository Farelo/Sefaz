const debug = require('debug')('model:engines')
const mongoose = require('mongoose')
const Joi = require('joi')

const engineSchema = new mongoose.Schema({
    tag: {
        code: {
            type: String,
            minlength: 4,
            maxlength: 25,
            required: true
        },
    },
    serial: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true
    },
    part_number: {
        type: String,
        minlength: 0,
        maxlength: 100,
    },
    
    model: {
        type: String,
        minlength: 0,
        maxlength: 100,
    },
    
    observations: {
        type: String,
        minlength: 0,
        maxlength: 250,
    },
    active: {
        type: Boolean,
        default: false
    },
    
    id_engine_type: {
        type: mongoose.Schema.ObjectId,
        ref: 'Engine_type',
        required: true
    },
    
    id_rack_transport: {
        type: mongoose.Schema.ObjectId,
        ref: 'Rack_Transport',
        required: true
    },
    
})

const validate_engines = (engine) => {
    const schema = Joi.object().keys({
        tag: {
            code: Joi.string().min(4).max(25).required(),
        },
        serial: Joi.string().min(2).max(30).required(),
        part_number: Joi.string().min(0).max(100),
        model: Joi.string().min(0).max(100),
        observations: Joi.string().min(0).max(250).allow(''),
        active: Joi.boolean(),
        id_engine_type: Joi.objectId().required(),
        id_rack_transport: Joi.objectId().required()
    })

    return Joi.validate(engine, schema, { abortEarly: false })
}

engineSchema.statics.findByTag = function (tag, projection = '') {
    return this.findOne({ 'tag.code': tag }, projection)
}

const update_updated_at_middleware = function (next) {
    let update = this.getUpdate()
    update.update_at = new Date()
    next()
}

engineSchema.pre('update', update_updated_at_middleware)
engineSchema.pre('findOneAndUpdate', update_updated_at_middleware)

const Engine = mongoose.model('Engine', engineSchema)

exports.Engine = Engine
exports.engineSchema = engineSchema
exports.validate_engines = validate_engines