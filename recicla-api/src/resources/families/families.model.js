const mongoose = require('mongoose')
const Joi = require('joi')

const familySchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    packings: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Packing'
    }],
    routes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Route'
    }],
    control_points: [{
        type: mongoose.Schema.ObjectId,
        ref: 'ControlPoint'
    }],
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company'
    }
})

const validate_families = (family) => {
    const schema = {
        code: Joi.string().min(5).max(255).required(),
        packings: Joi.objectId(),
        company: Joi.objectId()
    }

    return Joi.validate(family, schema)
}

const Family = mongoose.model('Family', familySchema)

exports.Family = Family
exports.familySchema = familySchema
exports.validate_families = validate_families