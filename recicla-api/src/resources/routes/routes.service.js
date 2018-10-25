const debug = require('debug')('service:routes')
const _ = require('lodash')
const { Route } = require('./routes.model')

exports.get_routes = async () => {
    try {
        const routes = await Route.find()
            .populate('route', ['_id', 'code'])
            .populate('first_point', ['_id', 'name', 'type'])
            .populate('second_point', ['_id', 'name', 'type'])

        return routes
    } catch (error) {
        throw new Error(error)
    }
}

exports.get_route = async (id) => {
    try {
        const route = await Route.findById(id)
            .populate('route', ['_id', 'code'])
            .populate('first_point', ['_id', 'name', 'type'])
            .populate('second_point', ['_id', 'name', 'type'])

        return route
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_code = async (code) => {
    try {
        const route = await Route.findByCode(code)
        return route
    } catch (error) {
        throw new Error(error)
    }
}

exports.create_route = async (route) => {
    try {
        const new_route = new Route(route)
        await new_route.save()

        return new_route
    } catch (error) {
        throw new Error(error)
    }
}

exports.find_by_id = async (id) => {
    try {
        const route = await Route.findById(id)
        return route
    } catch (error) {
        throw new Error(error)
    }
}

exports.update_route = async (id, route_edited) => {
    try {
        const options = { runValidators: true, new: true }
        const route = await Route.findByIdAndUpdate(id, route_edited, options)

        return route
    } catch (error) {
        throw new Error(error)
    }
}