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
    family: {
        type: mongoose.Schema.ObjectId,
        ref: 'Family',
        required: true
    },
    model: {
        type: String,
        minlength: 0,
        maxlength: 100,
    },
    production_date:{
        type: Date,
        //pattern: /([0-9]{4})-(?:[0-9]{2})-([0-9]{2})/,
        //example: "2019-05-17",
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
        ref: 'EngineType',
        required: true
    },
    
    id_rack: {
        type: mongoose.Schema.ObjectId,
        ref: 'Rack',
        required: true
    },
    
})

const validate_engines = (engine) => {
    const schema = Joi.object().keys({
        tag: {
            code: Joi.string().min(4).max(25).required(),
        },
        serial: Joi.string().min(2).max(30).required(),
        //part_number: Joi.string().min(0).max(100),
        model: Joi.string().min(0).max(100),
        observations: Joi.string().min(0).max(250).allow(''),
        active: Joi.boolean(),
        id_engine_type: Joi.objectId().required(),
        id_rack: Joi.objectId().required()
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