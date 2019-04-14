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
    duns: {
        type: String,
        maxlength: 50,
    },
    phone: {
        type: String,
        maxlength: 14
    },
    cnpj: {
        type: String,
        maxlength: 20
    },
    address: {
        city: {
            type: String,
            maxlength: 50
        },
        street: {
            type: String,
            maxlength: 50
        },
        cep: {
            type: String,
            maxlength: 9
        },
        uf: {
            type: String,
            maxlength: 2
        }
    },
    type: {
        type: String,
        required: true,
        enum: ['owner', 'supplier', 'client'],
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
        duns: Joi.string().max(50).allow(null, ''),
        phone: Joi.string().max(14).allow(null, ''),
        cnpj: Joi.string().max(20).allow(null, ''),
        address: {
            city: Joi.string().max(50).allow(null, ''),
            street: Joi.string().max(50).allow(null, ''),
            cep: Joi.string().max(9).allow(null, ''),
            uf: Joi.string().max(2).allow(null, '')
        },
        type: Joi.string().valid(['owner', 'supplier', 'client'])
    })
    return Joi.validate(company, schema, { abortEarly: false })
}

const update_updated_at_middleware = function (next) {
    let update = this.getUpdate()
    update.update_at = new Date()
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