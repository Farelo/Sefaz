const debug = require('debug')('controller:departments')
const HttpStatus = require('http-status-codes')
const departments_service = require('./departments.service')
const logs_controller = require('../logs/logs.controller')

exports.all = async (req, res) => {
    const name = req.query.name ? req.query.name : null
    const departments = await departments_service.get_departments(name)

    res.json(departments)
}

exports.show = async (req, res) => {
    const department = await departments_service.get_department(req.params.id)
    if (!department) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid department.' })

    res.json(department)
}

exports.create = async (req, res) => {
    let department = await departments_service.find_by_name(req.body.name)
    if (department) return res.status(HttpStatus.BAD_REQUEST).send('Department already exists with this name.')

    department = await departments_service.create_department(req.body)
    logs_controller.create({token:req.headers.authorization, log:'create_department', newData:req.body});

    res.status(HttpStatus.CREATED).send(department)
}

exports.update = async (req, res) => {
    let department = await departments_service.find_by_id(req.params.id)
    if (!department) return res.status(HttpStatus.NOT_FOUND).send('Invalid department')

    department = await departments_service.update_department(req.params.id, req.body)
    logs_controller.create({token:req.headers.authorization, log:'update_department', newData:req.body});

    res.json(department)
}

exports.delete = async (req, res) => {
    const department = await departments_service.find_by_id(req.params.id)
 
    if (!department) res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid department' })

    logs_controller.create({token:req.headers.authorization, log:'delete_department', newData:department});
    await department.remove()

    res.send({ message: 'Delete successfully' })
}