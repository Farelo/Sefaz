const debug = require('debug')('controller:families')
const _ = require('lodash')
const HttpStatus = require('http-status-codes')
const { Family } = require('./families.model')

exports.all = async (req, res) => {
    const families = await Family.find().populate('company', ['_id', 'name', 'type'])

    res.json(families)
}

exports.show = async (req, res) => {
    const family = await Family
        .findById(req.params.id)
        .populate('company', ['_id', 'name', 'type'])

    if (!family) return res.status(HttpStatus.NOT_FOUND).send('Invalid family')

    res.json(family)
}

exports.create = async (req, res) => {
    family = new Family(req.body)
    await family.save()

    res.send(family)
}

exports.update = async (req, res) => {
    let family = await Family.findById(req.params.id)
    if (!family) return res.status(HttpStatus.NOT_FOUND).send('Invalid family')

    const options = { runValidators: true, new: true }

    family = await Family.findByIdAndUpdate(req.params.id, req.body, options)

    res.json(family)
}

exports.delete = async (req, res) => {
    const family = await Family.findById(req.params.id)
    if (!family) res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid family' })

    await family.remove()

    res.send({ message: 'Delete successfully' })
}