const express = require('express')
const logger = require('./config/winston.config')
const config = require('config')
const main = require('./scripts/main.script')
const app = express()

require('./startup/logger')(app)
require('./startup/db')()

main()

const server = app.listen(config.get('server.port'), () => {
    logger.info(`Server is running on port: ${config.get('server.port')}`)
})

module.exports = server