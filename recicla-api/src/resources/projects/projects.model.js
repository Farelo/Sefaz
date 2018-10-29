const debug = require('debug')('model:projects')
const mongoose = require('mongoose')
const Joi = require('joi')

const projectSchema = new mongoose.Schema({
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
const validate_projects = (project) => {
    const schema = Joi.object().keys({
        name: Joi.string().min(5).max(50).required()
    })

    return Joi.validate(project, schema, { abortEarly: false })
}

projectSchema.statics.findByName = function (name, projection = '') {
    return this.findOne({ name }, projection)
}

const update_updated_at_middleware = function (next) {
    this.update_at = Date.now
    next()
}

projectSchema.pre('update', update_updated_at_middleware)
projectSchema.pre('findOneAndUpdate', update_updated_at_middleware)

const Project = mongoose.model('Project', projectSchema)

exports.Project = Project
exports.projectSchema = projectSchema
exports.validate_projects = validate_projects