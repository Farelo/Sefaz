const debug = require('debug')('controller:reports')
const HttpStatus = require('http-status-codes')
const reports_service = require('./reports.service')

exports.general = async (req, res) => {
    const data = await reports_service.general()

    res.json(data)
}

exports.general = async (req, res) => {
    const data = await reports_service.general_inventory()

    res.json(data)
}

exports.snapshot = async (req, res) => {
    const data = await reports_service.snapshot()
    res.json(data)
}

exports.absent = async (req, res) => {
    const query = { 
        family: req.query.family ? req.query.family : null,
        serial: req.query.serial ? req.query.serial : null,
        absent_time_in_hours: req.query.absent_time_in_hours ? req.query.absent_time_in_hours : null,
    }

    const data = await reports_service.absent(query)
    res.json(data)
}