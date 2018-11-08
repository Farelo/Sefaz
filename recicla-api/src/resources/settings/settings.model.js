const debug = require('debug')('model:settings')
const mongoose = require('mongoose')
const Joi = require('joi')

const settingSchema = new mongoose.Schema({
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
        gc16: Joi.objectId(),
        enable_gc16: Joi.boolean(),
        battery_level_limit: Joi.number(),
        accuracy_limit: Joi.number(),
        job_schedule_time: Joi.number(),
        range_radius: Joi.number(),
        clean_historic_moviments_time: Joi.number(),
        no_signal_limit_in_days: Joi.number()
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