const debug = require('debug')('model:alertHistorys')
const mongoose = require('mongoose')
const { Packing } = require('../packings/packings.model')

const alertHistorySchema = new mongoose.Schema({
    packing: {
        type: mongoose.Schema.ObjectId,
        ref: 'Packing',
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

const update_packing = async (alert_history, next) => {
    try {
        await Packing.findByIdAndUpdate(alert_history.packing, { last_alert_history: alert_history._id }, { new: true })
        next()
    } catch (error) {
        next(error)
    }
}

alertHistorySchema.statics.findByPacking = function (packing_id, projection = '') {
    return this
        .find({ packing: packing_id }, projection)
        .sort({created_at: -1})
}

const saveAlertHistoryToPacking = function (doc, next) {
    update_packing(doc, next)
}

const update_updated_at_middleware = function (next) {
    let update = this.getUpdate()
    update.update_at = new Date()
    next()
}

alertHistorySchema.post('save', saveAlertHistoryToPacking)
alertHistorySchema.pre('update', update_updated_at_middleware)
alertHistorySchema.pre('findOneAndUpdate', update_updated_at_middleware)

const AlertHistory = mongoose.model('AlertHistory', alertHistorySchema)

exports.AlertHistory = AlertHistory
exports.alertHistorySchema = alertHistorySchema