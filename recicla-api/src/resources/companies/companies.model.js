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
        type: String,
        minlength: 6,
        maxlength: 50
    },
    cnpj: {
        type: String
    },
    address: {
        city: {
            type: String
        },
        street: {
            type: String
        },
        cep: {
            type: String
        },
        uf: {
            type: String
        }
    },
    type: {
        type: String,
        required: true,
        enum: ['owner', 'client'],
        lowercase: true,
        default: 'client',
        trim: true

    },
    users: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    control_points: [{
        type: mongoose.Schema.ObjectId,
        ref: 'ControlPoint'
    }]
})

companySchema.statics.findByName = function (name, projection = '') {
    return this.findOne({ name }, projection)
}

const validate_companies = (company) => {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(6).max(50),
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

const removeMiddleware = function (next) {
    var company = this;
    company.model('User').update(
        { company: company._id },
        { $unset: { company: 1 } },
        { multi: true },
        next
    )
}

companySchema.pre('remove', removeMiddleware)

const Company = mongoose.model('Company', companySchema)

exports.Company = Company
exports.companySchema = companySchema
exports.validate_companies = validate_companies