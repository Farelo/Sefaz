const debug = require('debug')('model:types')
const mongoose = require('mongoose')
const { Family } = require('./families.model') 

const gc16Schema = new mongoose.Schema({
    annual_volume: Number,
    capacity: Number,
    productive_days: Number,
    container_days: Number,
    family: {
        type: mongoose.Schema.ObjectId,
        ref: 'Family',
        required: true
    },
    security_factor: {
        percentage: Number,
        qty_total_build: Number,
        qty_container: Number,
    },
    frequency: {
        days: Number,
        fr: Number,
        qty_total_days: Number,
        qty_container: Number,
    },
    transportation_going: {
        days: Number,
        value: Number,
        qty_container: Number,
    },
    transportation_back: {
        days: Number,
        value: Number,
        qty_container: Number,
    },
    stock: {
        days: Number,
        value: Number,
        max: Number,
        qty_container: Number,
        qty_container_max: Number,
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

const update_family = async (gc16, next) => {
    try {
        await Family.findOneAndUpdate({ _id: gc16.family }, { gc16: gc16._id }, { new: true })
    } catch (error) {
        next(error)
    }
}

gc16Schema.statics.findByName = function (name, projection = '') {
    return this.findOne({ name }, projection)
}

const save_middleware = function(doc, next) {
    update_family(doc, next)
}

const update_updated_at_middleware = function (next) {
    let update = this.getUpdate()
    update.update_at = new Date()
    next()
}

gc16Schema.post('save', save_middleware)
gc16Schema.pre('update', update_updated_at_middleware)
gc16Schema.pre('findOneAndUpdate', update_updated_at_middleware)

const GC16 = mongoose.model('GC16', gc16Schema)

exports.GC16 = GC16
exports.gc16Schema = gc16Schema