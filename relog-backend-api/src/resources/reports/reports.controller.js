const debug = require('debug')('controller:reports')
const HttpStatus = require('http-status-codes')
const reports_service = require('./reports.service')

exports.general_report = async (req, res) => {
    const data = await reports_service.general_report()

    res.json(data)
}

exports.general_inventory_report = async (req, res) => {
    const data = await reports_service.general_inventory_report()

    res.json(data)
}

exports.absent_report = async (req, res) => {
    const query = { 
        family: req.query.family ? req.query.family : null,
        serial: req.query.serial ? req.query.serial : null,
        absent_time_in_hours: req.query.absent_time_in_hours ? req.query.absent_time_in_hours : null,
    }

    const data = await reports_service.absent_report(query)
    res.json(data)
}

exports.permanence_time_report = async (req, res) => {
    const query = {
        family: req.query.family ? req.query.family : null,
        serial: req.query.serial ? req.query.serial : null
    }

    const data = await reports_service.permanence_time_report(query)
    res.json(data)
}

exports.battery_report = async (req, res) => {
    const family_id = req.query.family ? req.query.family : null

    const data = await reports_service.battery_report(family_id)
    res.json(data)
}

exports.quantity_report = async (req, res) => {
    const family_id = req.query.family ? req.query.family : null

    const data = await reports_service.quantity_report(family_id)
    res.json(data)
}

exports.general_info_report = async (req, res) => {
    const family_id = req.query.family ? req.query.family : null

    const data = await reports_service.general_info_report(family_id)
    res.json(data)
}

exports.clients_report = async (req, res) => {
    const company_id = req.query.company ? req.query.company : null

    const data = await reports_service.clients_report(company_id)
    res.json(data)
}

exports.snapshot_report = async (req, res) => {
    req.setTimeout(50000)

    const data = await reports_service.snapshot_report()
    res.json(data)
}