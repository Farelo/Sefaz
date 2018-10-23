const debug = require('debug')('service:users')
const _ = require('lodash')
const { User } = require('./users.model')
const { Company } = require('../companies/companies.model')

exports.find_by_email = async (email) => {
    try {
        const user = await User.findByEmail(email)
        return user
    } catch (error) {
        throw new Error(error)
    }
}

exports.get_users = async () => {
    try {
        const users = await User
            .find()
            .select('-password')
            .populate('company')

        return users
    } catch (error) {
        throw new Error(error)
    }
}

exports.get_user = async (id) => {
    try {
        const user = await User
            .findById(id)
            .select('-password')
            .populate('company')

        return user
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_company_by_id = async (id) => {
    try {
        const company = await Company.findById(id)
        return company
    } catch (error) {
        throw new Error(error)
    }
}

exports.create_user = async (user) => {
    try {
        const new_user = new User(user)
        await new_user.save()

        return new_user
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_id = async (id) => {
    try {
        const user = await User.findById(id)
        return user
    } catch (error) {
        throw new Error(error)
    }
}

exports.update_user = async (id, user_edited) => {
    try {
        const options = { new: true }
        const user = await User.findByIdAndUpdate(id, user_edited, options)

        return user
    } catch (error) {
        throw new Error(error)
    }
}