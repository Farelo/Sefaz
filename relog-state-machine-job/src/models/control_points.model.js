const debug = require('debug')('model:control_points')
const mongoose = require('mongoose')

const controlPointSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true
    },
    duns: {
        type: String,
        minlength: 0,
        maxlength: 30,
    },
    geofence: {
        coordinates: [
            {
                lat: {
                    type: Number,
                    min: -90,
                    max: 90,
                    default: 0
                },
                lng: {
                    type: Number,
                    min: -180,
                    max: 180,
                    default: 0
                }
            }
        ],
        type: {
            type: String,
            enum: ['c', 'p'],
            default: 'c'
        },
        radius: {
            type: Number,
            maxlength: 100000,
            default: 0
        }
    },
    full_address: {
        type: String,
        minlength: 5,
        maxlength: 100
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type',
        required: true
    },
    FlagHT: {
        type: Boolean,
        default: false  
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    gc16: {
        type: mongoose.Schema.ObjectId,
        ref: 'GC16'
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

controlPointSchema.statics.findByName = function (name, projection = '') {
    return this.findOne({ name }, projection)
}

const update_updated_at_middleware = function (next) {
    let update = this.getUpdate()
    update.update_at = new Date()
    next()
}

controlPointSchema.pre('update', update_updated_at_middleware)
controlPointSchema.pre('findOneAndUpdate', update_updated_at_middleware)

const ControlPoint = mongoose.model('ControlPoint', controlPointSchema)

exports.ControlPoint = ControlPoint
exports.controlPointSchema = controlPointSchema