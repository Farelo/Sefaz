const express = require('express')
const logger = require('./config/winston.config')
const config = require('config')
const app = express()
const start_job_loka = require('./scripts/main.script')
const start_initial_load = require('./scripts/initial-load/initial-load')

require('./startup/logger')(app)
require('./startup/db')()

//TODO: colocar e testar pra quando o ENV=test nao fazer nenhum dos dois
if(process.env.NODE_ENV != 'test'){
    if (process.env.INITIAL_LOAD)
        start_initial_load()
    else
        start_job_loka()
}

const server = app.listen(config.get('server.port'), () => {
    logger.info(`Server is running on port: ${config.get('server.port')}`)
})

module.exports = server