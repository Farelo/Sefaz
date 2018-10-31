const debug = require('debug')('model:settings')
const mongoose = require('mongoose')

const settingSchema = new mongoose.Schema({
    gc16: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gc16',
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
    created_at: {
        type: Date,
        default: Date.now

    },
    update_at: {
        type: Date,
        default: Date.now
    }
})

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