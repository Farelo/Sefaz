const debug = require('debug')('controller:engine_types')
const HttpStatus = require('http-status-codes')
const engine_types_service = require('./engine_types.service')
const logs_controller = require('../logs/logs.controller')

exports.all = async (req, res) => {
    const code = req.query.code ? req.query.code : null
    const engine_types = await engine_types_service.get_engine_types(code)

    res.json(engine_types)
}

exports.show = async (req, res) => {
    const engine_type = await engine_types_service.get_engine_type(req.params.id)
    if (!engine_type) return res.status(HttpStatus.NOT_FOUND).send('Invalid engine type')

    res.json(engine_type)
}

exports.create = async (req, res) => {
    let engine_type = await engine_types_service.find_by_code(req.body.code)
    if (engine_type) return res.status(HttpStatus.BAD_REQUEST).send('engine type already exists with this code.')

    engine_type = await engine_types_service.create_engine_type(req.body)
    logs_controller.create({token:req.headers.authorization, log:'create_engine_type' , newData:req.body});

    res.status(HttpStatus.CREATED).send(engine_type)
}

exports.update = async (req, res) => {
    let engine_type = await engine_types_service.find_by_id(req.params.id)
    if (!engine_type) return res.status(HttpStatus.NOT_FOUND).send('Invalid engine type')

    engine_type = await engine_types_service.update_engine_type(req.params.id, req.body)
    logs_controller.create({token:req.headers.authorization, log:'update_engine_type' , newData:req.body});

    res.json(engine_type)
}

exports.delete = async (req, res) => {
    const engine_type = await engine_types_service.find_by_id(req.params.id)
    if (!engine_type) res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid engine type' })

    
    logs_controller.create({token:req.headers.authorization, log:'delete_engine_type' , newData:engine_type});
    await engine_type.remove()

    res.send({ message: 'Delete successfully' })
}