const debug = require("debug")("service:engines");
const _ = require("lodash");
const config = require("config");
const { Engine } = require("./engines.model");
const { Integration } = require("../integrations/integrations.model");
const rp = require("request-promise");
const mongoose = require("mongoose");

exports.create_engine = async (engine) => {
  try {
     const new_engine = new Engine(engine);
     await new_engine.save();
     // TODO: logs_controller.create({ token: req.headers.authorization, log: "create_engine", newData: req.body });
     return new_engine;
  } catch (error) {
     throw new Error(error);
  }
};

exports.get_engines = async (serial) => {
   try {
       if (!serial) return await Engine.find().populate('EngineType', ['_id', 'code']).populate('family', ['_id', 'code', 'company']).populate("Rack", ["_id", "name"]);
       const data = await Engine.findBySerial(serial)
       return data ? [data] : []
   } catch (error) {
       throw new Error(error)
   }
}


exports.get_engine = async (id) => {
   try {
      const engine = await Engine.findById(id)
         .populate("EngineType", ["_id", "code"])
         .populate("family", ["_id", "code", "company"])
         .populate("Rack", ["_id", "name"]);

      return engine;
   } catch (error) {
      throw new Error(error);
   }
};

exports.find_by_id = async (id) => {
   try {
      const engine = await Engine.findById(id)
      return engine;
   } catch (error) {
      throw new Error(error);
   }
};


exports.find_by_serial = async (serial) => {
   try {
      const engines = await Engine.findBySerial(serial) 
      return engines;
   } catch (error) {
      throw new Error(error);
   }
};

exports.update_engine = async (id, engine_edited) => {
   try {
      const options = { runValidators: true, new: true };
      const engine = await Engine.findByIdAndUpdate(id, engine_edited, options);

      return engine;
   } catch (error) {
      throw new Error(error);
   }
};



