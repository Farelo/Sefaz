const debug = require('debug')('controller:gc16')
const HttpStatus = require('http-status-codes')
const gc16_service = require('./gc16.service')
const families_service = require('../families/families.service')

exports.all = async (req, res) => {
    const gc16_list = await gc16_service.get_gc16_list()

    res.json(gc16_list)
}

exports.show = async (req, res) => {
    const gc16 = await gc16_service.get_gc16(req.params.id)

    if (!gc16) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid gc16' })

    res.json(gc16)
}

exports.create = async (req, res) => {
    const family = await families_service.find_by_id(req.body.family)
    if (!family) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid family.' })

    const gc16 = await gc16_service.create_gc16(req.body)

    res.status(HttpStatus.CREATED).send(gc16)
}

exports.update = async (req, res) => {
    let gc16 = await gc16_service.find_by_id(req.params.id)
    if (!gc16) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid gc16' })

    gc16 = await gc16_service.update_gc16(req.params.id, req.body)

    res.json(gc16)
}

exports.delete = async (req, res) => {
    const gc16 = await gc16_service.find_by_id(req.params.id)
    if (!gc16) res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid gc16' })

    await gc16.remove()

    res.send({ message: 'Delete successfully' })
}