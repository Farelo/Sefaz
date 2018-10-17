const debug = require('debug')('model:packings')
const mongoose = require('mongoose')
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
    active: Boolean,
    absent: Boolean,
    low_battery: Boolean,
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

// const addPackingToFamily = async (doc, next) => {
//     try {
//         const family = await Family.findById(doc.family)
//         family.packings.push(doc._id)

//         await family.save()
//     } catch (error) {
//         debug(error)
//         next()
//     }
// }
    
// const postUpdateMiddleware = function (doc, next) {
//     addPackingToFamily(doc, next)
// }

const removeMiddleware = function (next) {
    const packing = this;
    packing.model('Family').update(
        { packings: packing._id },
        { $pull: { packings: packing._id } },
        { multi: true },
        next()
    )
}

packingSchema.statics.findByTag = function (code, projection = '') {
    return this.findOne({ 'tag.code': code }, projection)
}

// packingSchema.post('update', postUpdateMiddleware)
// packingSchema.post('findOneAndUpdate', postUpdateMiddleware)
// packingSchema.pre('remove', removeMiddleware)

const Packing = mongoose.model('Packing', packingSchema)

exports.Packing = Packing
exports.packingSchema = packingSchema