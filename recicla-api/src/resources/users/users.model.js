const debug = require('debug')('model:users')
const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const bcrypt = require('bcrypt')
const config = require('config')
const jwt = require('jsonwebtoken')
const { Company } = require('../companies/companies.model')

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        minlength: 5,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    active: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        lowercase: true,
        default: 'user',
        trim: true
    },
    company: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'Company'
    }
})

const validate_user = (user) => {
    const schema = {
        full_name: Joi.string().min(5).max(255),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(6).max(1024).required(),
        role: Joi.string(),
        company: Joi.objectId()
    }

    return Joi.validate(user, schema)
}

const password_encrypt = async (obj, next) => {
    try {
        const salt = await bcrypt.genSalt(config.get('security.saltRounds'))
        const hashed_password = await bcrypt.hash(obj.password, salt)
        obj.password = hashed_password
        next()
    } catch (error) {
        next()
    }
}

const addUserToCompany = async (user, next) => {
    try {
        const company = await Company.findById(user.company)
        company.users.push(user._id)
        await company.save()

        next()
    } catch (error) {
        next()
    }
}

userSchema.statics.findByEmail = function (email, projection = '') {
    return this.findOne({ email }, projection)
}

userSchema.methods.generateUserToken = function () {
    const token = jwt.sign({ _id: this._id, role: this.role }, config.get('security.jwtPrivateKey'))
    return `Bearer ${token}`
}

userSchema.methods.passwordMatches = function (password) {
    return bcrypt.compare(password, this.password)
}

const saveMiddleware = function (next) {
    const user = this
    if (!user.isModified('password')) {
        next()
    } else {
        password_encrypt(user, next)
    }
}

const updateMiddleware = function (next) {
    if (!this.getUpdate().password) {
        next()
    } else {
        password_encrypt(this.getUpdate(), next)
    }
}

const removeMiddleware = function (next) {
    const user = this;
    user.model('Company').update(
        { users: user._id },
        { $pull: { users: user._id } },
        { multi: true },
        next()
    )
}

const postSaveMiddleware = function(doc, next) {
    addUserToCompany(doc, next)
}

userSchema.pre('save', saveMiddleware)
userSchema.post('save', postSaveMiddleware)
userSchema.pre('update', updateMiddleware)
userSchema.post('update', postSaveMiddleware)
userSchema.pre('findOneAndUpdate', updateMiddleware)
userSchema.post('findOneAndUpdate', postSaveMiddleware)
userSchema.pre('remove', removeMiddleware)

const User = mongoose.model('User', userSchema)

exports.User = User
exports.userSchema = userSchema
exports.validate_user = validate_user