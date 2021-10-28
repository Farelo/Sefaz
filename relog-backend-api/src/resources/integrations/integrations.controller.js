const HttpStatus = require("http-status-codes");
const engines_service = require("../engines/engines.service");
const integrations_service = require("./integrations.service");
const engine_types_service = require("../engine_types/engine_types.service");
const racks_service = require("../racks/racks.service");
const families_service = require("../families/families.service");
const logs_controller = require("../logs/logs.controller");

exports.createEngineAndIntegrate = async (req) => {
  try {
    //validation
    //TODO: também validar se o serial 2 já existe.
    //TODO: Verificar se faz sentido prosseguir com o vínculo quando apenas um serial existe
    const searchSerial = await engines_service.find_by_serial(req.serial);
    if (!!searchSerial) throw new Error("Engine Already exists");

    const family = await families_service.find_by_code(req.family);
    if (!family) throw new Error("Invalid rack family");

    const engine_type = await engine_types_service.find_by_code(req.id_engine_type);
    if (!engine_type) throw new Error("Invalid engine type");

    const rack = await racks_service.find_by_tag(req.id_rack);
    if (!rack) throw new Error("Invalid rack");

    //Create first engine
    createEngine(rack._id, family._id, engine_type._id, req.serial, req.fabrication_date);

    //Create second engine
    if (![null, ""].includes(req.serial2)) {
      createEngine(rack._id, family._id, engine_type._id, req.serial2, req.fabrication_date);
    }

    //Create integration
    createIntegration(rack._id, family._id, engine_type._id, req.serial, req.serial2, req.fabrication_date);

    return { result: "Success" };
  } catch (error) {
    throw {
      Fault: {
        Code: {
          Value: "soap:Sender",
          Subcode: { value: "rpc:BadArguments" },
        },
        Reason: { Text: error.message },
        statusCode: 500,
      },
    };
  }
};

const createEngine = async (rack, family, engineType, serial, fabricationDate) => {
  try {
    let engineOne = {
      family: family,
      id_engine_type: engineType,
      id_rack: rack,
      serial: serial,
      fabrication_date: fabricationDate,
    };

    await engines_service.create_engine(engineOne);
  } catch (error) {
    throw new Error(error);
  }
};

const createIntegration = async (rack, family, engineType, serialOne, serialTwo, fabricationDate) => {
  try {
    let newIntegration = {
      family: family,
      id_engine_type: engineType,
      id_rack: rack,
      serial: serialOne,
      serial2: serialTwo,
      fabrication_date: fabricationDate,
    };
    await integrations_service.create_integration(newIntegration);
  } catch (error) {
    throw new Error(error);
  }
};
