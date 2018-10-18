const debug = require('debug')('model:packings')
const mongoose = require('mongoose')
const Joi = require('joi')
const { Family } = require('../families/families.model')

// TODO: Adicionar os atributos: { gc16, last_device_data,  } 
const packingSchema = new mongoose.Schema({
    tag: {
        code: {
            type: String,
            required: true
        },
        version: String,
        manufactorer: String
    },
    serial: {
        type: String,
        required: true,
    },
    type: String,
    weigth: Number,
    width: Number,
    heigth: Number,
    length: Number,
    capacity: Number,
    temperature: Number,
    observations: String,
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
    family: {
        type: mongoose.Schema.ObjectId,
        ref: 'Family'
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
    const schema = {
        tag: {
            code: Joi.string().required(),
            version: Joi.string(),
            manufactorer: Joi.string()
        },
        serial: Joi.string().required(),
        type: Joi.string(),
        weigth: Joi.number(),
        width: Joi.number(),
        heigth: Joi.number(),
        length: Joi.number(),
        capacity: Joi.number(),
        observations: Joi.string(),
        active: Joi.boolean(),
        family: Joi.objectId()
    }

    return Joi.validate(packing, schema)
}

const addPackingToFamily = async (doc, next) => {
    try {
        const family = await Family.findById(doc.family)
        family.packings.push(doc._id)

        await family.save()
        next()
    } catch (error) {
        debug(error)
        next()
    }
}
    
const postUpdateMiddleware = function (doc, next) {
    addPackingToFamily(doc, next)
}

const removeMiddleware = function (doc, next) {
    const packing = doc;
    packing.model('Family').update(
        { packings: packing._id },
        { $pull: { packings: packing._id } },
        { multi: true },
        next()
    )
}

packingSchema.statics.findByTag = function (tag, projection = '') {
    return this.findOne({ 'tag.code': tag.code }, projection)
}

packingSchema.post('save', postUpdateMiddleware)
packingSchema.post('update', postUpdateMiddleware)
packingSchema.post('findOneAndUpdate', postUpdateMiddleware)
packingSchema.post('remove', removeMiddleware)

const Packing = mongoose.model('Packing', packingSchema)

exports.Packing = Packing
exports.packingSchema = packingSchema
exports.validate_packings = validate_packings