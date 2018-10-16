const mongoose = require('mongoose')
const Joi = require('joi')

const familySchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    packings: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Packing'
    }],
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company'
    }
})

familySchema.statics.findByCode = function(code, projection = '') {
    return this.findOne({ code }, projection)
}

const validate_families = (family) => {
    const schema = {
        code: Joi.string().unique().required(),
        packings: Joi.objectId(),
        company: Joi.objectId()
    }

    return Joi.validate(company, schema)
}

const Family = mongoose.model('Family', familySchema)

exports.Family = Family
exports.familySchema = familySchema
exports.validate_families = validate_families