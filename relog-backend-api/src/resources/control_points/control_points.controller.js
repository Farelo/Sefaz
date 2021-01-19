const debug = require('debug')('controller:control_points')
const HttpStatus = require('http-status-codes')
const control_points_service = require('./control_points.service')
const types_service = require('../types/types.service')
const companies_service = require('../companies/companies.service')
const logs_controller = require('../logs/logs.controller')

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
    if (control_point) return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Control Point already exists with this name.' })

    let type = await types_service.find_by_id(req.body.type)
    if (!type) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid type.' })

    let company = await companies_service.find_by_id(req.body.company)
    if (!company) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid company.' })

    control_point = await control_points_service.create_control_point(req.body)
    logs_controller.create({token:req.headers.authorization, log:'create_control_point', newData:req.body});
   
    res.status(HttpStatus.CREATED).send(control_point)
}

exports.create_many = async (req, res) => {
    let control_points = []

    for (let control_point of req.body) {
        let current_control_point = await control_points_service.find_by_name(control_point.data.name)
        if (current_control_point) return res.status(HttpStatus.BAD_REQUEST).send({ message: `Control Point already exists with this name: ${control_point.data.name};` })

        let type = await types_service.find_by_id(control_point.data.type._id)
        if (!type) return res.status(HttpStatus.NOT_FOUND).send({ message: `Invalid type: ${control_point.data.type._id};` })

        let company = await companies_service.find_by_id(control_point.data.company._id)
        if (!company) return res.status(HttpStatus.NOT_FOUND).send({ message: `Invalid company: ${control_point.data.company._id}` })

        current_control_point = await control_points_service.create_control_point(control_point.data)
        control_points.push(current_control_point)
        
        logs_controller.create({token:req.headers.authorization, log:'create_many_control_points', newData:control_point.data});
    }

    res.status(HttpStatus.CREATED).send(control_points)
}

exports.update = async (req, res) => {
    let control_point = await control_points_service.find_by_id(req.params.id)
    if (!control_point) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid control point.' })

    let type = await types_service.find_by_id(req.body.type)
    if (!type) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid type.' })

    let company = await companies_service.find_by_id(req.body.company)
    if (!company) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid company.' })
    
    control_point = await control_points_service.update_control_point(req.params.id, req.body)

    logs_controller.create({token:req.headers.authorization, log:'update_control_point', newData:req.body});

    res.json(control_point)
}

exports.delete = async (req, res) => {
    const control_point = await control_points_service.find_by_id(req.params.id)
    if (!control_point) res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid control_point.' })

    
    logs_controller.create({token:req.headers.authorization, log:'delete_control_point', newData:control_point});
    await control_point.remove()

    res.send({ message: 'Delete successfully' })
}