const mongoose = require('mongoose')
const Joi = require('joi')
const { User } = require('../users/users.model')

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: String
    },
    cnpj: String,
    address: {
        city: String,
        street: String,
        cep: String,
        uf: String
    },
    type: {
        type: String,
        required: true,
        enum: ['owner', 'client'],
        lowercase: true,
        default: 'client',
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

companySchema.statics.findByName = function (name, projection = '') {
    return this.findOne({ name }, projection)
}

const validate_companies = (company) => {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string(),
        cnpj: Joi.string(),
        address: {
            city: Joi.string(),
            street: Joi.string(),
            cep: Joi.string(),
            uf: Joi.string()
        } ,
        type: Joi.string()
    }

    return Joi.validate(company, schema)
}

// const postRemoveMiddleware = function (doc, next) {
//     var company = doc
//     company.model('User').update(
//         { company: company._id },
//         { $set: { active: false } },
//         { multi: true },
//         next()
//     )
// }

const removeMiddleware = function (doc, next) {
    const company = doc
    company.model('User').update(
        { company: company._id },
        { $unset: { company: 1 } },
        { multi: true },
        next()
    )
}

companySchema.post('remove', removeMiddleware)
// companySchema.post('remove', postRemoveMiddleware)

const Company = mongoose.model('Company', companySchema)

exports.Company = Company
exports.companySchema = companySchema
exports.validate_companies = validate_companies