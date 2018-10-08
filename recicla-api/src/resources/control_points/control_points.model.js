const mongoose = require('mongoose')
const { Company } = require('../companies/companies.model')

const controlPointSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    duns: {
        type: String
    },
    cnpj: {
        type: String
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    },
    full_address: {
        type: String
    },
    type: {
        type: String,
        required: true,
        enum: ['factory', 'supplier', 'logistic_op', 'others'],
        lowercase: true,
        default: 'others',
        trim: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }
})

const ControlPoint = mongoose.model('ControlPoint', controlPointSchema)

exports.ControlPoint = ControlPoint
exports.controlPointSchema = controlPointSchema