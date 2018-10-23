const debug = require('debug')('controller:packings')
const HttpStatus = require('http-status-codes')
const packings_service = require('./packings.service')

exports.all = async (req, res) => {
    const tag = req.query.tag_code ? { code: req.query.tag_code } : null
    const packings = await packings_service.get_packings(tag)

    res.json(packings)
}

exports.show = async (req, res) => {
    const packing = await packings_service.get_packing(req.params.id)

    if (!packing) return res.status(HttpStatus.NOT_FOUND).send('Invalid packing')

    res.json(packing)
}

exports.create = async (req, res) => {
    let packing = await packings_service.find_by_tag(req.body.tag)
    if (packing) return res.status(HttpStatus.BAD_REQUEST).send('Packing already exists with this code.')

    packing = await packings_service.create_packing(req.body)

    res.status(HttpStatus.CREATED).send(packing)
}

exports.update = async (req, res) => {
    let packing = await packings_service.find_by_id(req.params.id)
    if (!packing) return res.status(HttpStatus.NOT_FOUND).send('Invalid packing')

    packing = await packings_service.update_packing(req.params.id, req.body)

    res.json(packing)
}

exports.delete = async (req, res) => {
    const packing = await packings_service.find_by_id(req.params.id)
    if (!packing) res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid packing' })

    await packing.remove()

    res.send({ message: 'Delete successfully' })
}