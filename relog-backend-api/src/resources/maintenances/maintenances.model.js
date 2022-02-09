const debug = require('debug')('model:rack_items')
const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const config = require('config')

const rackItemsSchema = new mongoose.Schema({
    rack_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Rack'
    }, 
    date: {
        type: Date,
        default: Data.now()
    },
    problem_description: {
        type: String,
        minlength: 0,
        maxlength: 500,
    },
    solution_description: {
        type: String,
        minlength: 0,
        maxlength: 500,
    },
    description_photo: [{
        type: String
    }],
    rack_photo: {
        type: String
    },
    checklist_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Maintenance_checklist'
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
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
        //code: Joi.string().min(4).max(25).required(),
        name: Joi.string().min(5).max(255).required(),
        description: Joi.string().min(0).max(500).allow(''),
        price: {
            cost: Joi.number(),
            date: Joi.date()
        }
    })

    return Joi.validate(rack_item, schema, { abortEarly: false })
}


const RackItem = mongoose.model('RackItem', rackItemsSchema)

exports.RackItem = RackItem
exports.rackItemsSchema = rackItemsSchema
exports.validate_RackItem = validate_RackItem