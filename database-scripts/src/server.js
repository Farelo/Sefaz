const express = require('express')
const logger = require('./config/winston.config')
const config = require('config')
const app = express()


console.log('server . . . ')

require('./startup/logger')(app)
require('./startup/db')()

if (process.env.SCRIPT == 'without-battery') require('./scripts/update-last-battery-to-packings')()
else if (process.env.SCRIPT == 'battery-zero') require('./scripts/update-battery-with-zero')()
else if (process.env.SCRIPT == 'link-device-data') require('./scripts/link-event-records-and-device-data')()

const server = app.listen(config.get('server.port'), () => {
    logger.info(`Server is running on port: ${config.get('server.port')}`)
})

module.exports = server