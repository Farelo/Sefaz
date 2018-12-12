const debug = require('debug')('model:companies')
const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: String,
        minlength: 10,
        maxlength: 14
    },
    cnpj: {
        type: String,
        minlength: 14,
        maxlength: 20
    },
    address: {
        city: {
            type: String,
            minlength: 4,
            maxlength: 50
        },
        street: {
            type: String,
            minlength: 4,
            maxlength: 50
        },
        cep: {
            type: String,
            minlength: 8,
            maxlength: 9
        },
        uf: {
            type: String,
            minlength: 2,
            maxlength: 2
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