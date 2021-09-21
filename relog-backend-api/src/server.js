const express = require('express')
const logger = require('./config/winston.config')
const soap = require('soap');
const fs = require('fs');
const integration_controller = require('../src/resources/integrations/integrations.controller')
const config = require('config')
require('express-async-errors')

const app = express()

if (config.get('log.enabled')) require('./startup/logger')(app)
if (config.get('swagger.enabled')) require('./startup/swagger')(app)
require('./startup/routes')(app)
require('./startup/db')()
if (config.get('company.enabled')) require('./startup/startup_user')()

const server = app.listen(config.get('server.port'), () => {
    logger.info(`Server is running on port: ${config.get('server.port')}`)
})


function createIntegration(args) {
  console.log("nada")
  integration_controller.create_IntegrationId(args)
}


//WSDL server
var serviceObject = {
  IntegrationService: {
    IntegrationServiceSoapPort: {
     Integration : createIntegration
    },
    
  }
};


const appWsdl = express()
// load the WSDL file
var xml = fs.readFileSync(__dirname+'\\service.wsdl', 'utf8');
  
var serverWsdl = appWsdl.listen(`${config.get('serverWsdl.port')}`, () => {
    console.log('Listening on port ' + `${config.get('serverWsdl.port')}`);
    var wsdl_path = "/wsdl";
  soap.listen(appWsdl, wsdl_path, serviceObject, xml);
    logger.info(`Server is running on port: ${config.get('serverWsdl.port')}`)
})

module.exports = {server, serverWsdl}