const debug = require('debug')('service:engine_types')
const _ = require('lodash')
const { Engine_type } = require('./engine_types.model')
const { Route } = require('../routes/routes.model')

exports.get_engine_types = async (code) => {
    try {
        if (!code) return await Family.find().populate('name', ['_id', 'name'])

        const data = await Family.findByCode(code)
        return data ? [data] : []
    } catch (error) {
        throw new Error(error)
    }
}

exports.get_engine_type = async (id) => {
    try {
        let engine_type = await Engine_type
            .findById(id)
            .populate('name', ['_id', 'name'])
            
            

            engine_type.routes = await Promise.all(
            engine_type.routes.map(async route => {
                const temp_route = await Route.findById(route).populate('first_point').populate('second_point')
                return temp_route
            })
        )

        return engine_type
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_code = async (code) => {
    try {
        const engine_type = await Engine_type.findByCode(code)
        return engine_type
    } catch (error) {
        throw new Error(error)
    }
}

exports.create_engine_type = async (engine_type) => {
    try {
        const new_engine_type = new Engine_type(engine_type)
        await new_engine_type.save()

        return new_engine_type
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_id = async (id) => {
    try {
        const engine_type = await Engine_type.findById(id)
        return engine_type
    } catch (error) {
        throw new Error(error)
    }
}

exports.update_engine_type = async (id, engine_type_edited) => {
    try {
        const options = { runValidators: true, new: true }
        const engine_type = await Engine_type.findByIdAndUpdate(id, engine_type_edited, options)

        return engine_type
    } catch (error) {
        throw new Error(error)
    }
}