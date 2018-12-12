const debug = require('debug')('controller:control_points')
const HttpStatus = require('http-status-codes')
const settings_service = require('./settings.service')

exports.show = async (req, res) => {
    const setting = await settings_service.get_setting(req.params.id)
    if (!setting) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid setting.' })

    res.json(setting)
}

exports.update = async (req, res) => {
    let setting = await settings_service.find_by_id(req.params.id)
    if (!setting) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid setting.' })

    setting = await settings_service.update_setting(req.params.id, req.body)

    res.json(setting)
}