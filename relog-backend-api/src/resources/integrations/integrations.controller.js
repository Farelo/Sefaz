const soap = require("soap");
const url = "http://localhost:8090/wsdl?wsdl";
const parseString = require("xml2js").parseString;
const HttpStatus = require("http-status-codes");
const engines_service = require("../engines/engines.service");
const integrations_service = require("./integrations.service");
const engine_types_service = require("../engine_types/engine_types.service");
const racks_service = require("../racks/racks.service");
const families_service = require("../families/families.service");
const logs_controller = require("../logs/logs.controller");

process.on('exit', function(code) {
  return console.log(`About to exit with code ${code}`);
});

 exports.create_IntegrationId = async (req) => {
  createEngine(req);
  
};
 

async function createEngine(req) {

  
  const searchSerial = await engines_service.find_by_serial(req.serial);
  if (searchSerial != null){
    
    return console.log("Engine Already exists.");
  }

  
  const family = await families_service.find_by_code(req.family);
  if (!family)
    return console.log( "Invalid Family.");

  const engine_type = await engine_types_service.find_by_code(req.id_engine_type);
  if (!engine_type)
  
    return console.log(" Invalid Engine" );
  
  const rack = await racks_service.find_by_tag(req.id_rack);
  if (!rack){
    
    return console.log( "Invalid Rack.");
  }

  let engine = {

    family: family._id,
    id_engine_type: engine_type._id,
    id_rack: rack._id,
    serial: req.serial,
    fabrication_date: req.fabrication_date,
  };

  if (req.serial2 != null || req.serial2 != '') {
    let engine2 = {

    family: family._id,
    id_engine_type: engine_type._id,
    id_rack: rack._id,
    serial: req.serial2,
    fabrication_date: req.fabrication_date,
    };

    await engines_service.create_engine(engine2);
  }

  await engines_service.create_engine(engine);

  // logs_controller.create({
  //   token: req.headers.authorization,
  //   log: "create_engine",
  //   newData: req.body,
  // });
  
  let integration = {
    family: family._id,
    serial: req.serial,
    serial2: req.serial2,
    fabrication_date: req.fabrication_date,
    id_engine_type: engine_type._id,
    id_rack: rack._id,
  };

  createIntegration(integration);

  
}

async function createIntegration(req)  {
  

  await integrations_service.create_integration(req);
  console.log(req)
  
  setTimeout((function createIntegration() {
    return process.exit();
  }), 3000);
  
  //console.log(req)
  // logs_controller.create({
  //   token: req.headers.authorization,
  //   log: "create_integration",
  //   newData: req.body,
  // });
 
};

