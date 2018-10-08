const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const bcrypt = require('bcrypt')
const config = require('config')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
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
    role: {
        type: String,
        required: true,
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

userSchema.statics.findByEmail = function (email, projection = '') {
    return this.findOne({ email }, projection)
}

userSchema.methods.generateUserToken = function () {
    const token = jwt.sign({ _id: this._id, role: this.role }, config.get('security.jwtPrivateKey'))
    return token
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
    console.log('CHAMA!')
    const user = this;
    user.model('Company').update(
        { users: user._id },
        { $pull: { users: user._id } },
        { multi: true },
        next
    )
}

userSchema.pre('save', saveMiddleware)
userSchema.pre('update', updateMiddleware)
userSchema.pre('findOneAndUpdate', updateMiddleware)
userSchema.pre('remove', removeMiddleware)

const User = mongoose.model('User', userSchema)

exports.User = User
exports.userSchema = userSchema
exports.validate_user = validate_user