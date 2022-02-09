
const mongoose = require('mongoose')
const Joi = require('joi')

const price_Schema = new mongoose.Schema({
    item_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'RackItem'
    },
    cost: {
        type: Number,
        default: 0.00,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
})

const validate_prices = (price) => {
    const schema = Joi.object().keys({
        item_id: Joi.objectId(),
        cost: Joi.number().required(),
        date: Joi.date().required()
    })

    return Joi.validate(price, schema, { abortEarly: false })
}

const Price = mongoose.model('Price', price_Schema)

exports.Price = Price
exports.price_Schema = price_Schema
exports.validate_prices = validate_prices