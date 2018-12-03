const debug = require('debug')('controller:packings')
const HttpStatus = require('http-status-codes')
const packings_service = require('./packings.service')
const families_service = require('../families/families.service')
const projects_service = require('../projects/projects.service')

exports.all = async (req, res) => {
    const tag = req.query.tag_code ? { code: req.query.tag_code } : null
    const family = req.query.family ? req.query.family : null
    const packings = await packings_service.get_packings(tag, family)

    res.json(packings)
}

exports.show = async (req, res) => {
    const packing = await packings_service.get_packing(req.params.id)

    if (!packing) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid packing' })

    res.json(packing)
}

exports.create = async (req, res) => {
    let packing = await packings_service.find_by_tag(req.body.tag)
    if (packing) return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Packing already exists with this code.' })

    const family = await families_service.find_by_id(req.body.family)
    if (!family) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid family.' })

    if (req.body.project) {
        const project = await projects_service.find_by_id(req.body.project)
        if (!project) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid project.' })
    }

    packing = await packings_service.create_packing(req.body)

    res.status(HttpStatus.CREATED).send(packing)
}

exports.update = async (req, res) => {
    let packing = await packings_service.find_by_id(req.params.id)
    if (!packing) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid packing' })

    packing = await packings_service.update_packing(req.params.id, req.body)

    res.json(packing)
}

exports.delete = async (req, res) => {
    const packing = await packings_service.find_by_id(req.params.id)
    if (!packing) res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid packing' })

    await packing.remove()

    res.send({ message: 'Delete successfully' })
}