const express = require("express");
const logger = require("./config/winston.config");
const soap = require("soap");
const base64 = require("js-base64");
const fs = require("fs");
const integration_controller = require("../src/resources/integrations/integrations.controller");
const config = require("config");
require("express-async-errors");

const app = express();

if (config.get("log.enabled")) require("./startup/logger")(app);
if (config.get("swagger.enabled")) require("./startup/swagger")(app);
require("./startup/routes")(app);
require("./startup/db")();
if (config.get("company.enabled")) require("./startup/startup_user")();

const server = app.listen(config.get("server.port"), () => {
  logger.info(`Server is running on port: ${config.get("server.port")}`);
});

const createIntegration = async (req) => {
  try {
    return await integration_controller.createEngineAndIntegrate(req);
  } catch (error) {
    throw error;
  }
};

//WSDL server
var serviceObject = {
  IntegrationService: {
    IntegrationServiceSoapPort: {
      Integration: createIntegration,
    },
  },
};

const expressAppWSDL = express();
let wsdlFile = fs.readFileSync(__dirname + "\\service.wsdl", "utf8");

let expressAppWSDLinstance = expressAppWSDL.listen(`${config.get("serverWsdl.port")}`, () => {
  const wsdl_path = "/integrateRackEngine";
  let WSDLServer = soap.listen(expressAppWSDL, wsdl_path, serviceObject, wsdlFile);
  logger.info(`SOAP Server is running on port: ${config.get("serverWsdl.port")}`);

  WSDLServer.authorizeConnection = function (request, response) {
    
    if (request.method == "GET" ) return true;
    
    if (request.headers.authorization) {
      const authorization = request.headers.authorization;
      const authorizationToken = authorization.split(" ")[1];

      const decodedBase64 = base64.decode(authorizationToken);

      const username = decodedBase64.split(":")[0];
      const password = decodedBase64.split(":")[1];

      //TODO: puxar do banco de dados
      if (username == "0143cddd-f698-48f1-868b-5d969ee80b04")
        if (
          password ==
          "MIICXAIBAAKBgQCWeMwlAD2gP23U7SfKVbytUC+FIhY6e1N6j41Hn2uSPMIYtFnN+bXdkbZrSK1P2zFvjtp0dnmWnMk05f6uuQMh0+N8jxj1JF6TFX4G3pK7MaV3JaWBRF4Rxh4LXiDKwXzSj25dcoY6+MlbCUI0rumHmlwU8TRv4008oLHstaynywIDAQABAoGAZ4HtHD7QJZ28Vc5Vos/bnHUeWzyZgd04DYUWMICvpMb61beqVxBBVItZqu8xmU808IKaL6cX+M0dc7AKw/Is/lcAfbB8AB8jlEnqgZD01dkt55jO6HUeiDaL1MeEl01lcOMYEebMOyzfxZ13U3Avbti1tEmacF4yNPboPvejtWECQQDWt4+2C584C1d/vSlNh55ilEZNtr5X/g1Pxpv/KaQFSJi6It/UHVGZGaKbVJykKncB2vy/fEmwZ69W85Z+g+U5AkEAs2cRpo9tdbx1mY2xg/gYoR4n+x0xfujuTGkzi6i8wyZ7c4zm3w224qDRMTJJq2YQmzRCGCxSK3os6rkong/ZIwJBAM5lMsKGV22TEW/b0FkTVT9jUlUfpcaFkhwuSQO07lKZ3x2FqmyGJkqp5rGzWsM/gpgI/c2/VkI42MYXboF8nZkCQCXD+K87WiuCtK7SaSACxgyEsJ3oE1dH6YIkUzl/F91s6Gf2rVMfK/ShLehRUbjHD4/cfF1iVxnX6kSvHaHIbEkCQB6RonRsIPG+QKJAZbBzkzqolfT3b/KT4C+vFWUjNrh6cW2OlJ9zMa18UzvtNZHy5XHqw8SSxn2IqSKPVezawd8="
        )
          return true;

      response.statusCode = 401;
      // response.statusMessage = "Invalid username or password";

      return false;
    } else {
      response.statusCode = 401;
      // response.statusMessage = "Invalid username or password";
      return false;
    }
  };
});

module.exports = { server, expressAppWSDLinstance };
