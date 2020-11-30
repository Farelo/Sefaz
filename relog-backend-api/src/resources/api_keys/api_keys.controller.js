const debug = require('debug')('controller:apiKeys')
const HttpStatus = require('http-status-codes')
const apiKeysService = require('./api_keys.service')

exports.all = async (req, res) => {
    console.log("controller: all");
    const apiKeys = await apiKeysService.getApiKeys()
    res.json(apiKeys)
}

exports.show = async (req, res) => {
    const apiKeys = await apiKeysService.getApiKeys(req.params.id)
    if (!apiKeys) return res.status(HttpStatus.NOT_FOUND).send('Invalid api key')

    res.json(apiKeys)
}

exports.create = async (req, res) => {
    const apiKeys = await apiKeysService.createApiKeys(req.body)
    res.status(HttpStatus.CREATED).send(apiKeys)
}

exports.update = async(req, res) => {
    let apiKeys = await apiKeysService.findById(req.params.id)
    if (!apiKeys) return res.status(HttpStatus.NOT_FOUND).send('Invalid api key')

    apiKeys = await apiKeysService.updateApiKey(req.params.id, req.body)

    res.json(apiKeys)
}

exports.delete = async (req, res) => {
    const apiKeys = await apiKeysService.findById(req.params.id)
    if (!apiKeys) res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid api key' })

    await apiKeys.remove()

    res.send({ message: 'Deleted successfully'})
}