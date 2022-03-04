const debug = require('debug')('model:rack_items')
const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const config = require('config')

const rackItemsSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
        unique: true
    },
    description: {
        type: String,
        minlength: 0,
        maxlength: 250,
    },
    current_price: {
        type: mongoose.Schema.ObjectId,
        ref: 'Price'
    },
    prices: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Price'
    }],
    excluded_at: {
        type: Date
    }
})

const validate_RackItem = (rack_item) => {
    const schema = Joi.object().keys({
        name: Joi.string().min(3).max(255).required(),
        description: Joi.string().min(0).max(500).allow(''),
        current_price: Joi.number(),
        date: Joi.date()
    })

    return Joi.validate(rack_item, schema, { abortEarly: false })
}

const RackItem = mongoose.model('RackItem', rackItemsSchema)

exports.RackItem = RackItem
exports.rackItemsSchema = rackItemsSchema
exports.validate_RackItem = validate_RackItem