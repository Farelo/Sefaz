const express = require('express')
const logger = require('./config/winston.config')
const config = require('config')
const initialize = require('./scripts/initialize.script')
const main = require('./scripts/main.script')
const app = express()

require('./startup/logger')(app)
require('./startup/db')()
initialize()
main()
// require('./scripts/main.script')()


// TESTE DE CARGA: loadtest -c 100 -t 15 http://localhost:4000
// app.get('/', (req, res, next) => {
//     for (let i = 0; i < 1e8; i++) {}
//     res.json({pid: process.pid, echo: req.query})
// })

const server = app.listen(config.get('server.port'), () => {
    logger.info(`Server is running on port: ${config.get('server.port')}`)
})

module.exports = server