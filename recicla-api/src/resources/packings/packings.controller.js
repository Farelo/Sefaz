const debug = require('debug')('controller:packings')
const _ = require('lodash')
const HttpStatus = require('http-status-codes')
const { Packing } = require('./packings.model')

exports.all = async (req, res) => {
    const packings = await Packing.find().populate('packing', ['_id', 'code'])

    res.json(packings)
}

exports.show = async (req, res) => {
    const packing = await Packing
        .findById(req.params.id)
        .populate('family', ['_id', 'code', 'company'])

    if (!packing) return res.status(HttpStatus.NOT_FOUND).send('Invalid packing')

    res.json(packing)
}

exports.create = async (req, res) => {
    let packing = await Packing.findByTag(req.body.tag)
    if (packing) return res.status(HttpStatus.BAD_REQUEST).send('Packing already exists with this code.')

    packing = new Packing(req.body)
    await packing.save()

    res.send(packing)
}

exports.update = async (req, res) => {
    let packing = await Packing.findById(req.params.id)
    if (!packing) return res.status(HttpStatus.NOT_FOUND).send('Invalid packing')

    const options = { runValidators: true, new: true }

    packing = await Packing.findByIdAndUpdate(req.params.id, req.body, options)

    res.json(packing)
}

exports.delete = async (req, res) => {
    const packing = await Packing.findById(req.params.id)
    if (!packing) res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid packing' })

    await packing.remove()

    res.send({ message: 'Delete successfully' })
}