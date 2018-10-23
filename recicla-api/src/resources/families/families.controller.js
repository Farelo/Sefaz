const debug = require('debug')('controller:families')
const _ = require('lodash')
const HttpStatus = require('http-status-codes')
const { Family } = require('./families.model')

exports.all = async (req, res) => {
    let families
    const code = req.query.code ? req.query.code : null
    
    if (code) {
        families = await Family.findByCode(code)
        // if (!families) families = []
    } else {
        families = await Family.find().populate('company', ['_id', 'name', 'type'])
    }

    res.json(families)
}

exports.show = async (req, res) => {
    const family = await Family
        .findById(req.params.id)
        .populate('company', ['_id', 'name', 'type'])
        .populate('packings', ['_id', 'tag', 'serial', 'active', 'low_battery','absent'])

    if (!family) return res.status(HttpStatus.NOT_FOUND).send('Invalid family')

    res.json(family)
}

exports.create = async (req, res) => {
    let family = await Family.findByCode(req.body.code)
    if (family) return res.status(HttpStatus.BAD_REQUEST).send('Family already exists with this code.')

    family = new Family(req.body)
    await family.save()

    res.status(HttpStatus.CREATED).send(family)
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