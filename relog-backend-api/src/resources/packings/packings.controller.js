const debug = require('debug')('controller:packings')
const HttpStatus = require('http-status-codes')
const packings_service = require('./packings.service')
const families_service = require('../families/families.service')
const projects_service = require('../projects/projects.service')
const control_points_service = require('../control_points/control_points.service')

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

exports.create_many = async (req, res) => {
    let packings = []

    for (let packing of req.body) {
        let current_packing = await packings_service.find_by_tag(packing.data.tag)
        if (current_packing) return res.status(HttpStatus.BAD_REQUEST).send({ message: `Packing already exists with this code ${packing.data.tag.code}.` })
    
        const family = await families_service.find_by_id(packing.data.family._id)
        if (!family) return res.status(HttpStatus.NOT_FOUND).send({ message: `Invalid family ${packing.data.family}.` })
    
        if (packing.data.project) {
            const project = await projects_service.find_by_id(packing.data.project)
            if (!project) return res.status(HttpStatus.NOT_FOUND).send({ message: `Invalid project ${packing.data.project}.` })
        }
    
        current_packing = await packings_service.create_packing(packing.data)
        packings.push(current_packing)
    }

    res.status(HttpStatus.CREATED).send(packings)
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

exports.show_packings_on_control_point = async (req, res) => {
    const { control_point_id } = req.params

    const control_point = await control_points_service.get_control_point(control_point_id)
    if (!control_point) return res.status(HttpStatus.NOT_FOUND).send('Invalid company')

    const data = await packings_service.get_packings_on_control_point(control_point)

    res.json(data)
}

exports.check_device = async (req, res) => {
    const { device_id } = req.params

    const data = await packings_service.check_device(device_id)

    res.json(data)
}