const debug = require('debug')('model:settings')
const mongoose = require('mongoose')
const Joi = require('joi')

const settingSchema = new mongoose.Schema({
    expiration_date:{
        type: Date,
        default: Date.now
    },
    enable_gc16: {
        type: Boolean,
        default: false
    },
    battery_level_limit: {
        type: Number,
        default: 0
    },
    accuracy_limit: {
        type: Number,
        default: 0
    },
    job_schedule_time_in_sec: {
        type: Number,
        default: 50
    },
    range_radius: {
        type: Number,
        default: 0
    },
    clean_historic_moviments_time: {
        type: Number,
        default: 0
    },
    no_signal_limit_in_days: {
        type: Number,
        default: 1
    },
    missing_sinal_limit_in_days: {
        type: Number,
        default: 1
    },
    enable_viagem_perdida: {
        type: Boolean,
        default: true
    },
    enable_local_incorreto: {
        type: Boolean,
        default: true
    },
    enable_viagem_atrasada: {
        type: Boolean,
        default: true
    },
    enable_sem_sinal: {
        type: Boolean,
        default: true
    },
    enable_perdida: {
        type: Boolean,
        default: true
    },
    double_check_incorrect_local:{
        type: Boolean,
        default: false
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

const validate_settings = (setting) => {
    const schema = Joi.object().keys({
        expiration_date: Joi.date(),
        enable_gc16: Joi.boolean(),
        battery_level_limit: Joi.number().min(0),
        accuracy_limit: Joi.number().min(0),
        job_schedule_time_in_sec: Joi.number().min(0),
        range_radius: Joi.number().min(0),
        clean_historic_moviments_time: Joi.number().min(0),
        no_signal_limit_in_days: Joi.number().min(0),
        missing_sinal_limit_in_days: Joi.number().min(0),
        enable_viagem_perdida: Joi.boolean(),
        enable_local_incorreto: Joi.boolean(),
        enable_viagem_atrasada: Joi.boolean(),
        enable_sem_sinal: Joi.boolean(),
        enable_perdida: Joi.boolean(),
        double_check_incorrect_local: Joi.boolean()
    })

    return Joi.validate(setting, schema, { abortEarly: false })
}

const update_updated_at_middleware = function (next) {
    let update = this.getUpdate()
    update.update_at = new Date()
    next()
}

settingSchema.pre('update', update_updated_at_middleware)
settingSchema.pre('findOneAndUpdate', update_updated_at_middleware)

const Setting = mongoose.model('Setting', settingSchema)

exports.Setting = Setting
exports.settingSchema = settingSchema
exports.validate_settings = validate_settings