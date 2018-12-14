const debug = require('debug')('model:gc16')
const mongoose = require('mongoose')

const { Family } = require('./families.model')

const gc16Schema = new mongoose.Schema({
    annual_volume: {
        type: Number,
        default: 0
    },
    capacity: {
        type: Number,
        default: 0
    },
    productive_days: {
        type: Number,
        default: 0
    },
    container_days: {
        type: Number,
        default: 0
    },
    family: {
        type: mongoose.Schema.ObjectId,
        ref: 'Family',
        required: true,
        unique: true
    },
    security_factor: {
        percentage: {
            type: Number,
            default: 0
        },
        qty_total_build: {
            type: Number,
            default: 0
        },
        qty_container: {
            type: Number,
            default: 0
        }
    },
    frequency: {
        days: {
            type: Number,
            default: 0
        },
        fr: {
            type: Number,
            default: 0
        },
        qty_total_days: {
            type: Number,
            default: 0
        },
        qty_container: {
            type: Number,
            default: 0
        }
    },
    transportation_going: {
        days: {
            type: Number,
            default: 0
        },
        value: {
            type: Number,
            default: 0
        },
        qty_container: {
            type: Number,
            default: 0
        }
    },
    transportation_back: {
        days: {
            type: Number,
            default: 0
        },
        value: {
            type: Number,
            default: 0
        },
        qty_container: {
            type: Number,
            default: 0
        }
    },
    owner_stock: {
        days: {
            type: Number,
            default: 0
        },
        value: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 0
        },
        qty_container: {
            type: Number,
            default: 0
        },
        qty_container_max: {
            type: Number,
            default: 0
        }
    },
    client_stock: {
        days: {
            type: Number,
            default: 0
        },
        value: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 0
        },
        qty_container: {
            type: Number,
            default: 0
        },
        qty_container_max: {
            type: Number,
            default: 0
        }
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
        const family = await Family.findById(gc16.family)
        if (!family) return null

        await Family.findByIdAndUpdate(gc16.family, { gc16: gc16._id }, { new: true })
        next()
    } catch (error) {
        next(error)
    }
}

const unset_gc16_in_family = async (gc16, next) => {
    try {
        const family = await Family.findById(gc16.family)
        if (!family) return null

        await Family.findByIdAndUpdate(gc16.family, { $unset: { gc16: gc16._id } })
        next()
    } catch (error) {
        next(error)
    }
}

const save_middleware = function (doc, next) {
    update_family(doc, next)
}

const update_updated_at_middleware = function (next) {
    let update = this.getUpdate()
    update.update_at = new Date()
    next()
}

const remove_middelware = function (next) {
    unset_gc16_in_family(this, next)
}

gc16Schema.post('save', save_middleware)
gc16Schema.pre('update', update_updated_at_middleware)
gc16Schema.pre('findOneAndUpdate', update_updated_at_middleware)
gc16Schema.post('findOneAndUpdate', save_middleware)
gc16Schema.pre('remove', remove_middelware)

const GC16 = mongoose.model('GC16', gc16Schema)

exports.GC16 = GC16
exports.gc16Schema = gc16Schema