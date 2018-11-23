const express = require('express')
const logger = require('./config/winston.config')
const config = require('config')
require('express-async-errors')
const dm_main_script = require('./jobs/loka/main.script')

const app = express()

if (config.get('log.enabled')) require('./startup/logger')(app)
if (config.get('swagger.enabled')) require('./startup/swagger')(app)
require('./startup/routes')(app)
require('./startup/db')()
if (config.get('company.enabled')) require('./startup/startup_user')()

// dm_main_script()

const server = app.listen(config.get('server.port'), () => {
    logger.info(`Server is running on port: ${config.get('server.port')}`)
})

module.exports = server