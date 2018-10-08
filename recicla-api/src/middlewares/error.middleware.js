const debug = require('debug')('middlewares:error')
const winston = require('winston')

module.exports = (err, req, res, next) => {
    // TODO: Log the exception
    debug(err.message)
    winston.error(err.message, err)
    res.status(500).send('Something failed.')
}