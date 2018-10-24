const debug = require('debug')('model:companies')
const mongoose = require('mongoose')
const Joi = require('joi')

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
    const schema = Joi.object().keys({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string(),
        cnpj: Joi.string(),
        address: {
            city: Joi.string(),
            street: Joi.string(),
            cep: Joi.string(),
            uf: Joi.string()
        },
        type: Joi.string().valid(['owner','client'])
    })
    return Joi.validate(company, schema, { abortEarly: false })
}

const update_updated_at_middleware = function (next) {
    this.update_at = Date.now
    next()
}

const removeMiddleware = function (doc, next) {
    const company = doc
    company.model('User').update(
        { company: company._id },
        { $unset: { company: 1 } },
        { multi: true },
        next()
    )
}

companySchema.pre('update', update_updated_at_middleware)
companySchema.pre('findOneAndUpdate', update_updated_at_middleware)

companySchema.post('remove', removeMiddleware)

const Company = mongoose.model('Company', companySchema)

exports.Company = Company
exports.companySchema = companySchema
exports.validate_companies = validate_companies