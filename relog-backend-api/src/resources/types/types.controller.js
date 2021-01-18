const debug = require('debug')('controller:types')
const HttpStatus = require('http-status-codes')
const types_service = require('./types.service')
const logs_controller = require('../logs/logs.controller')

exports.all = async (req, res) => {
    const name = req.query.name ? req.query.name : null
    const types = await types_service.get_types(name)

    res.json(types)
}

exports.show = async (req, res) => {
    const type = await types_service.get_type(req.params.id)
    if (!type) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid type.' })

    res.json(type)
}

exports.create = async (req, res) => {
    let type = await types_service.find_by_name(req.body.name)
    if (type) return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Type already exists with this name.' })

    type = await types_service.create_type(req.body)

    logs_controller.create({token:req.headers.authorization, log:'create_control_point_type', newData:req.body});
    res.status(HttpStatus.CREATED).send(type)
}

exports.update = async (req, res) => {
    let type = await types_service.find_by_id(req.params.id)
    if (!type) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid type' })

    type = await types_service.update_type(req.params.id, req.body)
    logs_controller.create({token:req.headers.authorization, log:'update_control_point_type', newData:req.body});
    
    res.json(type)
}

exports.delete = async (req, res) => {
    const type = await types_service.find_by_id(req.params.id)
    if (!type) res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid type' })

    logs_controller.create({token:req.headers.authorization, log:'delete_control_point_type', newData:type});
    await type.remove()

    res.send({ message: 'Delete successfully' })
}