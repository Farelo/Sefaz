const debug = require('debug')('service:engine_types')
const _ = require('lodash')
const { Engine_type } = require('./engine_types.model')
const { Route } = require('../routes/routes.model')

exports.get_engine_types = async (code) => {
    try {
        if (!code) return await EngineType.find()

        const data = await EngineType.findByName(code)
        return data ? [data] : []
    } catch (error) {
        throw new Error(error)
    }
}

exports.get_engine_types = async (id) => {
    try {
        const engine_type = await EngineType
            .findById(id)
        return engine_type
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_code = async (code) => {
    try {
        const engine_type = await EngineType.findByCode(code)
        return engine_type
    } catch (error) {
        throw new Error(error)
    }
}

exports.create_engine_type = async (engine_type) => {
    try {
        const new_engine_type = new EngineType(engine_type)
        await new_engine_type.save()

        return new_engine_type
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_id = async (id) => {
    try {
        const engine_type = await EngineType.findById(id)
        return engine_type
    } catch (error) {
        throw new Error(error)
    }
}

exports.update_engine_type = async (id, engine_type_edited) => {
    try {
        const options = { runValidators: true, new: true }
        const engine_type = await EngineType.findByIdAndUpdate(id, engine_type_edited, options)

        return engine_type
    } catch (error) {
        throw new Error(error)
    }
}