const mongoose = require('mongoose')

const familySchema = new mongoose.Schema({
    code: {
        type: String,
        minlength: 3,
        maxlength: 25,
        required: true,
        unique: true
    },
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
        ref: 'Company',
        required: true
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

familySchema.statics.findByCode = function (code, projection = '') {
    return this.findOne({ code }, projection)
}

const update_updated_at_middleware = function (next) {
    this.update_at = Date.now
    next()
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

familySchema.pre('update', update_updated_at_middleware)
familySchema.pre('findOneAndUpdate', update_updated_at_middleware)
familySchema.post('remove', removeMiddleware)

const Family = mongoose.model('Family', familySchema)

exports.Family = Family
exports.familySchema = familySchema