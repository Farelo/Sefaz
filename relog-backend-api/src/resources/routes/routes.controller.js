const debug = require('debug')('controller:control_points')
const HttpStatus = require('http-status-codes')
const routes_service = require('./routes.service')
const families_service = require('../families/families.service')
const control_points_service = require('../control_points/control_points.service')

exports.all = async (req, res) => {
    const routes = await routes_service.get_routes()

    res.json(routes)
}

exports.show = async (req, res) => {
    const route = await routes_service.get_route(req.params.id)
    if (!route) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid route.' })

    res.json(route)
}

exports.create = async (req, res) => {
    const family = await families_service.find_by_id(req.body.family)
    if (!family) return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Family do not exists.' })

    const first_point = await control_points_service.find_by_id(req.body.first_point)
    if (!first_point) return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Control Point do not exists.' })

    const second_point = await control_points_service.find_by_id(req.body.second_point)
    if (!second_point) return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Control Point do not exists.' })

    const route = await routes_service.create_route(req.body)

    res.status(HttpStatus.CREATED).send(route)
}

exports.update = async (req, res) => {
    let route = await routes_service.find_by_id(req.params.id)
    if (!route) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid route.' })

    route = await routes_service.update_route(req.params.id, req.body)

    res.json(route)
}

exports.delete = async (req, res) => {
    const route = await routes_service.find_by_id(req.params.id)
    if (!route) res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid route' })

    await route.remove()

    res.send({ message: 'Delete successfully' })
}