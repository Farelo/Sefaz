const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const maitenance_schema = new mongoose.Schema({
    rack_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Rack'
    }, 
    date: {
        type: Date,
        default: new Date()
    },
    problem_description: {
        type: String,
        minlength: 0,
        maxlength: 250,
    },
    solution_description: {
        type: String,
        minlength: 0,
        maxlength: 250,
    },
    description_photo: [{
        type: String
    }],
    rack_photo: {
        type: String
    },
    /* checklist_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Maintenance_checklist'
    }, */
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    user_auxiliar1: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false
    },
    user_auxiliar2: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false
    },
    items: [{
        item: {
            type: mongoose.Schema.ObjectId,
            ref: 'RackItem'
        },
        price:{
            type: mongoose.Schema.ObjectId,
            ref: 'Price'
        }
    }],
    total_cost: {
        type: Number
    },
    excluded_at: {
        type: Date
    }
})

const validate_maintenance = (maintenance) => {
    const schema = Joi.object().keys({
       rack_id: Joi.objectId().required(),
       date: Joi.date().required(),
       problem_description: Joi.string().min(3).max(250),
       solution_description: Joi.string().min(3).max(250),
       description_photo: Joi.array().items(Joi.string()),
       rack_photo: Joi.string(),
       user_id: Joi.objectId(),
       items: Joi.array().items({
           item: Joi.objectId(),
           price: Joi.objectId()
       }),
       total_cost: Joi.number()
    })

    return Joi.validate(maintenance, schema, { abortEarly: false })
}


const Maintenance = mongoose.model('Maintenance', maitenance_schema)

exports.Maintenance = Maintenance
exports.maitenance_schema = maitenance_schema
exports.validate_maintenance = validate_maintenance