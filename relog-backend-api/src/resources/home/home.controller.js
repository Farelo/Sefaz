const debug = require('debug')('controller:home')
const HttpStatus = require('http-status-codes')
const home_service = require('./home.service')

exports.home_report = async (req, res) => {
    const current_state = req.query.current_state ? req.query.current_state : null
    const data = await home_service.home_report(current_state)
    res.json(data)
}

exports.home_low_battery_report = async (req, res) => {
    const data = await home_service.home_low_battery_report()
    res.json(data)
}

exports.home_permanence_time_exceeded_report = async (req, res) => {
    const data = await home_service.home_permanence_time_exceeded_report()
    res.json(data)
}