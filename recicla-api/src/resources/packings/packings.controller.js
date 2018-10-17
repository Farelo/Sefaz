const debug = require('debug')('controller:packings')
const _ = require('lodash')
const HttpStatus = require('http-status-codes')
const { Packing } = require('./packings.model')

exports.all = async (req, res) => {
    // const packings = await Family.find().populate('company', ['_id', 'name', 'type'])
    const packings = await Packing.find().populate('family', ['_id', 'code'])

    res.json(packings)
}