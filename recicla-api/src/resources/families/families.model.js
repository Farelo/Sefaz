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

const validate_families = (family) => {
    const schema = {
        code: Joi.string().required(),
        packings: Joi.objectId(),
        company: Joi.objectId()
    }

    return Joi.validate(family, schema)
}

const removeMiddleware = function (doc, next) {
    const family = doc
    family.model('Packing').update(
        { family: family._id },
        { $unset: { family: 1 } },
        { multi: true },
        next()
    )
}

familySchema.statics.findByCode = function (code, projection = '') {
    return this.findOne({ 'tag.code': code }, projection)
}

familySchema.post('remove', removeMiddleware)

const Family = mongoose.model('Family', familySchema)

exports.Family = Family
exports.familySchema = familySchema
exports.validate_families = validate_families