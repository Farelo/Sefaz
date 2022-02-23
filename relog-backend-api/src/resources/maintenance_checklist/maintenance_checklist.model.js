const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)


const maintenanceChecklistSchema = new mongoose.Schema({
    maintenance_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Maintenance'
    }, 
    items: [{
        minlength: 0,
        maxlength: 250,
        type: String
    }],
    excluded_at: {
        type: Date
    }
})

const validate_maintenance_checklist = (maintenance_checklist) => {
    const schema = Joi.object().keys({
        maintenance_id: Joi.objectId().required(),
        items: Joi.array().items(Joi.objectId())
    })

    return Joi.validate(maintenance_checklist, schema, { abortEarly: false })
}


const Maintenance_checklist = mongoose.model('Maintenance_checklist', maintenanceChecklistSchema)

exports.Maintenance_checklist = Maintenance_checklist
exports.maintenanceChecklistSchema = maintenanceChecklistSchema
exports.validate_maintenance_checklist = validate_maintenance_checklist