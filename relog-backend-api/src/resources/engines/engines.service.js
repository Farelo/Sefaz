const debug = require("debug")("service:engines");
const _ = require("lodash");
const config = require("config");
const { Engine } = require("./engines.model");
const { EngineType } = require("../engine_types/engine_types.model");
const { Rack } = require("../racks/racks.model");
const rp = require("request-promise");
const mongoose = require("mongoose");

exports.get_engines = async (tag, engine_type) => {
   try {
      if (!tag) {
         if (engine_type)
            return await Engine.find({ engine_type: engine_type })
               .populate("EngineType", ["_id", "code"])
               .populate("Rack," ["_id", "name"]);
               

         return await Engine.find()
            .populate("EngineType", ["_id", "code"])
            .populate("Rack," ["_id", "name"]);
            
      } 

      const data = await Engine.findByTag(tag)
         .populate("EngineType", ["_id", "code"])
         .populate("family", ["_id", "code", "company"])
         .populate("Rack," ["_id", "name"]);

      return data ? [data] : [];
   } catch (error) {
      throw new Error(error);
   }
};

exports.get_engine = async (id) => {
   try {
      const engine = await Engine.findById(id)
         .populate("EngineType", ["_id", "code"])
         .populate("family", ["_id", "code", "company"])
         .populate("Rack," ["_id", "name"]);

      return engine;
   } catch (error) {
      throw new Error(error);
   }
};

exports.find_by_tag = async (tag) => {
   try {
      return await Engine.findByTag(tag)
      .populate("EngineType", ["_id", "code"])
      .populate("Rack," ["_id", "name"]);
   } catch (error) {
      throw new Error(error);
   }
};

exports.populatedFindByTag = async (tag) => {
   try {
      return await Engine.findByTag(tag)
      .populate("EngineType", ["_id", "code"])
      .populate("family", ["_id", "code", "company"])
      .populate("Rack," ["_id", "name"]);
   } catch (error) {
      throw new Error(error);
   }
};

exports.create_engine = async (engine) => {
   try {
      const new_engine = new Engine(engine);
      await new_engine.save();

      return new_engine;
   } catch (error) {
      throw new Error(error);
   }
};

exports.find_by_id = async (id) => {
   try {
      const engine = await Engine.findById(id)
       .populate("engine_type", ["_id", "code"])
       .populate("Rack," ["_id", "name"])
       .populate("family", ["_id", "code", "company"]);
         

      return engine;
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



