const express = require('express')
const logger = require('./config/winston.config')
const config = require('config')
const app = express()

const script = require('./scripts/update-last-battery-to-packings')

console.log('server . . . ')

require('./startup/logger')(app)
require('./startup/db')()

script()

const server = app.listen(config.get('server.port'), () => {
    logger.info(`Server is running on port: ${config.get('server.port')}`)
})

module.exports = server