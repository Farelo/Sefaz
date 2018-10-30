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
    job_schedule_time: {
        type: Number,
        default: 0
    },
    range_radius: {
        type: Number,
        default: 0
    },
    clean_historic_moviments_time: {
        type: Number,
        default: 0
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

const Route = mongoose.model('Route', settingSchema)

exports.Route = Route
exports.settingSchema = settingSchema