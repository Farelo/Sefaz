const debug = require('debug')('model:types')
const mongoose = require('mongoose')

const typeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true
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

typeSchema.statics.findByName = function (name, projection = '') {
    return this.findOne({ name }, projection)
}

const update_updated_at_middleware = function (next) {
    let update = this.getUpdate()
    update.update_at = new Date()
    next()
}

typeSchema.pre('update', update_updated_at_middleware)
typeSchema.pre('findOneAndUpdate', update_updated_at_middleware)

const Type = mongoose.model('Type', typeSchema)

exports.Type = Type
exports.typeSchema = typeSchema