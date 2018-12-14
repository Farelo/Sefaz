const debug = require('debug')('model:packings')
const mongoose = require('mongoose')
const Joi = require('joi')

const packingSchema = new mongoose.Schema({
    tag: {
        code: {
            type: String,
            minlength: 4,
            maxlength: 25,
            required: true
        },
        version: {
            type: String,
            minlength: 1,
            maxlength: 30,
        },
        manufactorer: {
            type: String,
            minlength: 2,
            maxlength: 30,
        }
    },
    serial: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true
    },
    type: {
        type: String,
        minlength: 0,
        maxlength: 30,
    },
    weigth: {
        type: Number,
        max: 10000,
        default: 0
    },
    width: {
        type: Number,
        max: 10000,
        default: 0
    },
    heigth: {
        type: Number,
        max: 10000,
        default: 0
    },
    length: {
        type: Number,
        max: 10000,
        default: 0
    },
    capacity: {
        type: Number,
        max: 10000,
        default: 0
    },
    temperature: {
        type: Number,
        max: 1000,
        default: 0
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
    absent: {
        type: Boolean,
        default: false
    },
    low_battery: {
        type: Boolean,
        default: false
    },
    permanence_time_exceeded: {
        type: Boolean,
        default: false
    },
    family: {
        type: mongoose.Schema.ObjectId,
        ref: 'Family',
        required: true
    },
    last_device_data: {
        type: mongoose.Schema.ObjectId,
        ref: 'DeviceData'
    },
    last_current_state_history: {
        type: mongoose.Schema.ObjectId,
        ref: 'CurrentStateHistory'
    },
    last_department: {
        type: mongoose.Schema.ObjectId,
        ref: 'Department'
    },
    last_event_record: {
        type: mongoose.Schema.ObjectId,
        ref: 'EventRecord'
    },
    project: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project'
    },
    current_state: {
        type: String,
        required: true,
        enum: [
            'desabilitada_com_sinal',
            'desabilitada_sem_sinal',
            'analise',
            'viagem_em_prazo',
            'viagem_atrasada',
            'viagem_perdida',
            'sem_sinal',
            'perdida',
            'local_correto',
            'local_incorreto'
        ],
        lowercase: true,
        default: 'analise',
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

const validate_packings = (packing) => {
    const schema = Joi.object().keys({
        tag: {
            code: Joi.string().min(4).max(25).required(),
            version: Joi.string().min(1).max(30),
            manufactorer: Joi.string().min(2).max(30)
        },
        serial: Joi.string().min(2).max(30).required(),
        type: Joi.string().min(0).max(30),
        weigth: Joi.number().max(10000),
        width: Joi.number().max(10000),
        heigth: Joi.number().max(10000),
        length: Joi.number().max(10000),
        capacity: Joi.number().max(10000),
        observations: Joi.string().min(0).max(250).allow(''),
        active: Joi.boolean(),
        family: Joi.objectId().required(),
        project: Joi.objectId()
    })

    return Joi.validate(packing, schema, { abortEarly: false })
}

packingSchema.statics.findByTag = function (tag, projection = '') {
    return this.findOne({ 'tag.code': tag.code }, projection)
}

const update_updated_at_middleware = function (next) {
    let update = this.getUpdate()
    update.update_at = new Date()
    next()
}

packingSchema.pre('update', update_updated_at_middleware)
packingSchema.pre('findOneAndUpdate', update_updated_at_middleware)

const Packing = mongoose.model('Packing', packingSchema)

exports.Packing = Packing
exports.packingSchema = packingSchema
exports.validate_packings = validate_packings