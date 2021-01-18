const debug = require('debug')('controller:families')
const HttpStatus = require('http-status-codes')
const families_service = require('./families.service')
const logs_controller = require('../logs/logs.controller')

exports.all = async (req, res) => {
    const code = req.query.code ? req.query.code : null
    const families = await families_service.get_families(code)

    res.json(families)
}

exports.show = async (req, res) => {
    const family = await families_service.get_family(req.params.id)
    if (!family) return res.status(HttpStatus.NOT_FOUND).send('Invalid family')

    res.json(family)
}

exports.create = async (req, res) => {
    let family = await families_service.find_by_code(req.body.code)
    if (family) return res.status(HttpStatus.BAD_REQUEST).send('Family already exists with this code.')

    family = await families_service.create_family(req.body)
    logs_controller.create({token:req.headers.authorization, log:'create_family' , newData:req.body});

    res.status(HttpStatus.CREATED).send(family)
}

exports.update = async (req, res) => {
    let family = await families_service.find_by_id(req.params.id)
    if (!family) return res.status(HttpStatus.NOT_FOUND).send('Invalid family')

    family = await families_service.update_family(req.params.id, req.body)
    logs_controller.create({token:req.headers.authorization, log:'update_family' , newData:req.body});

    res.json(family)
}

exports.delete = async (req, res) => {
    const family = await families_service.find_by_id(req.params.id)
    if (!family) res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid family' })

    
    logs_controller.create({token:req.headers.authorization, log:'delete_family' , newData:family});
    await family.remove()

    res.send({ message: 'Delete successfully' })
}