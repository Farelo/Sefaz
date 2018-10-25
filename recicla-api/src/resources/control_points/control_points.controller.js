const debug = require('debug')('controller:control_points')
const HttpStatus = require('http-status-codes')
const control_points_service = require('./control_points.service')

exports.all = async (req, res) => {
    const name = req.query.name ? req.query.name : null
    const control_points = await control_points_service.get_control_points(name)

    res.json(control_points)
}

exports.show = async (req, res) => {
    const control_point = await control_points_service.get_control_point(req.params.id)
    if (!control_point) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid control point.' })

    res.json(control_point)
}

exports.create = async (req, res) => {
    let control_point = await control_points_service.find_by_name(req.body.name)
    if (control_point) return res.status(HttpStatus.BAD_REQUEST).send('Control Point already exists with this name.')

    control_point = await control_points_service.create_control_point(req.body)

    res.status(HttpStatus.CREATED).send(control_point)
}

exports.update = async (req, res) => {
    let control_point = await control_points_service.find_by_id(req.params.id)
    if (!control_point) return res.status(HttpStatus.NOT_FOUND).send('Invalid control_point')

    control_point = await control_points_service.update_control_point(req.params.id, req.body)

    res.json(control_point)
}

exports.delete = async (req, res) => {
    const control_point = await control_points_service.find_by_id(req.params.id)
    if (!control_point) res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid control_point' })

    await control_point.remove()

    res.send({ message: 'Delete successfully' })
}