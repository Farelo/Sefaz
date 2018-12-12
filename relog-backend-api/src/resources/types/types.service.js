const debug = require('debug')('service:types')
const _ = require('lodash')
const { Type } = require('./types.model')

exports.get_types = async (name) => {
    try {
        if (!name) return await Type.find()

        const data = await Type.findByName(name)
        return data ? [data] : []
    } catch (error) {
        throw new Error(error)
    }
}

exports.get_type = async (id) => {
    try {
        const type = await Type.findById(id)

        return type
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_name = async (name) => {
    try {
        const type = await Type.findByName(name)
        return type
    } catch (error) {
        throw new Error(error)
    }
}

exports.create_type = async (type) => {
    try {
        const new_type = new Type(type)
        await new_type.save()

        return new_type
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_id = async (id) => {
    try {
        const type = await Type.findById(id)
        return type
    } catch (error) {
        throw new Error(error)
    }
}

exports.update_type = async (id, type_edited) => {
    try {
        const options = { runValidators: true, new: true }
        const type = await Type.findByIdAndUpdate(id, type_edited, options)

        return type
    } catch (error) {
        throw new Error(error)
    }
}