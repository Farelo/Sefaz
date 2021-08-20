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

const res2 = `<?XML version=1.0 encoding=“utf-8”?>
<Raks>
    <idrack>123</idrack>
    <modelorack>D08</modelorack>
    <dtVinculo>00/00/000</dtVinculo>
    <motores>
        <idmotor1>1234567A123456</idmotor1>
        <idmotor2>1234567A123456</idmotor2>
    </motores>
    <modelomotor>2T2100015ME</modelomotor>
</Raks>`;

//const teste = createClientAsync();
let resposta;

exports.create_IntegrationId = async (res) => {
  var promise = new Promise((resolve, reject) => {
    soap.createClient(url, (err, client) => {
      if (err) {
        reject(err);
      }
      resolve(client);
      client.MessageSplitter(function (err, res) {
        if (err) throw err;
        // print the service returned result
        parseString(res, function (err, result) {
          resposta = result;
          console.log(result);
          createEngine(result);
        });
      });
    });
  }).catch(console.log("nada"));
  res.status(HttpStatus.CREATED).send("engines");
};


async function createEngine(req) {

  console.log(req.Rack.Engine[0].serial1)
  const searchSerial = await engines_service.find_by_serial(req.Rack.Engine[0].serial1);
  if (searchSerial != null){
    console.log("    Serial Existe" );
    return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid Rack." });
  }


  console.log("teste da massa: \n\n\n\n\n\  " + req.Rack.Engine[0].serial1+ "\n\n\n\n\n\ a" );
  const family = await families_service.find_by_code(req.Rack.RackModel);
  if (!family)
    return res
      .status(HttpStatus.NOT_FOUND)
      .send({ message: "Invalid Family." });

  const engine_type = await engine_types_service.find_by_code(
    req.Rack.engine_type
  );
  if (!engine_type){
  console.log("    Erro Engine" );
    return res
      .status(HttpStatus.NOT_FOUND)
      .send({ message: "Invalid Engine." });
    }
  const rack = await racks_service.find_by_tag(req.Rack.id_rack);
  if (!rack){
    console.log("    Erro Rack" );
    return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid Rack." });
  }

  let engine = {
    model: req.Rack.RackModel,//ajustar isso
    family: family._id,
    id_engine_type: engine_type._id,
    id_rack: rack._id,
    serial: req.Rack.Engine[0].serial1,
    production_date: req.Rack.Date,
  };

  if (req.Rack.Engine[0].serial1 != null || req.Rack.Engine[0].serial2 != "") {
    let engine2 = {
    model: req.Rack.RackModel,//ajustar isso
    family: family._id,
    id_engine_type: engine_type._id,
    id_rack: rack._id,
    serial: req.Rack.Engine[0].serial1,
    production_date: req.Rack.Date,
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
    serial: req.Rack.Engine[0].serial1,
    serial2: req.Rack.Engine[0].serial2,
    dtVinculo: req.Rack.dtVinculo,
    id_engine_type: engine_type._id,
    id_rack: rack._id,
  };

  createIntegration(integration);

  //res.status(HttpStatus.CREATED).send(engine);
}

async function createIntegration(req)  {
  

  await integrations_service.create_integration(req);
  console.log(req)
  // logs_controller.create({
  //   token: req.headers.authorization,
  //   log: "create_integration",
  //   newData: req.body,
  // });

  //res.status(HttpStatus.CREATED).send(integration);
};
