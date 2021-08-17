const soap = require('soap');
const url = 'http://localhost:8090/wsdl?wsdl';
const parseString = require('xml2js').parseString;

const integrations_service = require("./integrations.service");
const racks_service = require("../racks/racks.service");
const families_service = require('../families/families.service')




//const teste = createClientAsync();

exports.create_IntegrationId = function createClientAsync() {
  console.log("teste")
  return new Promise((resolve, reject) => {
    soap.createClient(url, (err, client) => {
      if (err) {
        reject(err);
      }
      resolve(client);
      client.MessageSplitter(function (err, res) {
        if (err)
          throw err;
        // print the service returned result
        parseString(res, function (err, result) {
          create_integration(result);
        });
      });
    });
  });
}



  exports.create = async (req, res) => {

    const family = await families_service.findByCode(req.Rack.RackModel);
    if (!family) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid Family." });
  
    const engine_type = await engine_types_service.findByCode(req.Rack.engine.Enginemodel);
    if (!engine_type) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid Engine." });

    const rack = await racks_service.find_by_tag(req.rack.id_rack);
    if (!rack) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid Rack." });

    let integration = {
      id_rack: rack._id,
      family: family._id,
      dtVinculo: req.Rack.Date,
      serial: req.Rack.engines.serialEngine1,
      id_engine_type: engineType._id,
      code: req.Rack
      
    }

     await integrations_service.create_integration(integration);
 
    logs_controller.create({ token: req.headers.authorization, log: "create_integration", newData: req.body });
 
    res.status(HttpStatus.CREATED).send(integration);
 };




