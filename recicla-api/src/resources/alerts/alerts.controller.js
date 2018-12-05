const debug = require('debug')('controller:alerts')
const HttpStatus = require('http-status-codes')
const alerts_service = require('./alerts.service')

exports.all = async (req, res) => {
    const data = await alerts_service.get_alerts()
    res.json(data)
}

exports.all_by_family = async (req, res) => {
    const data = await alerts_service.get_alerts_by_family(req.params.family_id, req.params.current_state)
    res.json(data)
}