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

const validate_user = (user) => {
    const schema = {
        full_name: Joi.string().min(5).max(255),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(6).max(1024).required(),
        role: Joi.string(),
        company: Joi.objectId().required()
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


const save_user_in_company = async (user, next) => {
    try {
        const company = await Company.findById({_id: user.company})
        company.users.push(user._id)
        await company.save()
        next()
    } catch (error) {
        next()
    }
}

const update_user_in_company = async (user, next) => {
    try {
        const company = await Company.findById({ _id: user.company })
        company.users.push(user._id)
        await company.save()
        next()
    } catch (error) {
        next()
    }
}

// MIDDLEWARES
const encrypt_password_middleware = function (next) {
    const user = this
    if (!user.isModified('password')) {
        next()
    } else {
        password_encrypt(user, next)
    }
}

const update_encrypt_password_middleware = function (next) {
    const user = this
    if (!user.getUpdate().password) {
        next()
    } else {
        password_encrypt(user.getUpdate(), next)
    }
}

const add_user_to_company_middleware = function (next) {
    const user = this
    save_user_in_company(user, next)
}

const update_user_to_company_middleware = function (doc, next) {
    const user = doc
    update_user_in_company(user, next)
}

const update_updated_at_middleware = function (next) {
    this.update_at = Date.now
    next()
}

// const test = async (user, next) => {
//     try {
//         const company = await Company.find({ users: user._id })
//         if (company) console.log(user)
//         // const u = company.users.filter(u => {
//         //     return u !== user._id
//         // })

//         console.log(company)
//         next()
//     } catch (error) {
//         console.log(error)
//         next(error)
//     }
// }


// const update_remove_company_middleware = function (next) {
// }

const remove_company_middleware = function (next) {
    const user = this
    user.model('Company').update(
        { users: user._id },
        { $pull: { users: user._id } },
        { multi: true },
        next()
    )
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

userSchema.pre('save', encrypt_password_middleware)
userSchema.pre('save', add_user_to_company_middleware)

userSchema.pre('update', update_encrypt_password_middleware)
// userSchema.pre('update', remove_company_middleware)
userSchema.pre('update', update_updated_at_middleware)
userSchema.post('update', update_user_to_company_middleware)

userSchema.pre('findOneAndUpdate', update_encrypt_password_middleware)
// userSchema.pre('findOneAndUpdate', remove_company_middleware)
userSchema.pre('findOneAndUpdate', update_updated_at_middleware)
userSchema.post('findOneAndUpdate', update_user_to_company_middleware)

userSchema.pre('remove', remove_company_middleware)

const User = mongoose.model('User', userSchema)

exports.User = User
exports.userSchema = userSchema
exports.validate_user = validate_user