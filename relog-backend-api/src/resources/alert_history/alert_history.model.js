const debug = require('debug')('model:alertHistorys')
const mongoose = require('mongoose')
const { Rack } = require('../racks/racks.model')

const alertHistorySchema = new mongoose.Schema({
    rack: {
        type: mongoose.Schema.ObjectId,
        ref: 'Rack',
        required: true
    },
    type: {
        type: String,
        enum: [
            'no_signal',
            'missing',
            'late',
            'travelling',
            'incorrect_local',
            'permanence_exceeded',
            'battery_low'
        ],
        lowercase: true,
        default: 'nosignal',
        trim: true
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

const update_rack = async (alert_history, next) => {
    try {
        await Rack.findByIdAndUpdate(alert_history.rack, { last_alert_history: alert_history._id }, { new: true })
        next()
    } catch (error) {
        next(error)
    }
}

alertHistorySchema.statics.findByRack = function (rack_id, projection = '') {
    return this
        .find({ rack: rack_id }, projection)
        .sort({created_at: -1})
}

const saveAlertHistoryToRack = function (doc, next) {
    update_rack(doc, next)
}

const update_updated_at_middleware = function (next) {
    let update = this.getUpdate()
    update.update_at = new Date()
    next()
}

alertHistorySchema.post('save', saveAlertHistoryToRack)
alertHistorySchema.pre('update', update_updated_at_middleware)
alertHistorySchema.pre('findOneAndUpdate', update_updated_at_middleware)

const AlertHistory = mongoose.model('AlertHistory', alertHistorySchema)

exports.AlertHistory = AlertHistory
exports.alertHistorySchema = alertHistorySchema