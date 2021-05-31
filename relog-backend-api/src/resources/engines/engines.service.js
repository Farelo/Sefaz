const debug = require("debug")("service:engines");
const _ = require("lodash");
const config = require("config");
const { Engine } = require("./engines.model");
const { Engine_type } = require("../engine_types/engine_types.model");
const rp = require("request-promise");
const mongoose = require("mongoose");

exports.get_engines = async (tag, engine_type) => {
   try {
      if (!tag) {
         if (engine_type)
            return await Engine.find({ engine_type: engine_type })
               .populate("engine_type", ["_id", "code"])
               

         return await Engine.find()
            .populate("engine_type", ["_id", "code"])
            
      } 

      const data = await Engine.findByTag(tag)
         .populate("engine_type", ["_id", "code"])
         .populate("project", ["_id", "name"])
         .populate("Rack_Transport");

      return data ? [data] : [];
   } catch (error) {
      throw new Error(error);
   }
};

exports.get_engine = async (id) => {
   try {
      const engine = await Engine.findById(id)
      .populate("engine_type", ["_id", "code"])
      .populate("project", ["_id", "name"])
      .populate("Rack_Transport");

      return engine;
   } catch (error) {
      throw new Error(error);
   }
};

exports.find_by_tag = async (tag) => {
   try {
      return await Engine.findByTag(tag)
         .populate("family", ["_id", "code", "company"])
         .populate("project", ["_id", "name"]);
   } catch (error) {
      throw new Error(error);
   }
};

exports.populatedFindByTag = async (tag) => {
   try {
      return await Engine.findByTag(tag)
         .populate("family", ["_id", "code", "company"])
         .populate("project", ["_id", "name"])
         .populate("last_position")
         .populate("last_battery")
         .populate("last_temperature")
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
         .populate("family", ["_id", "code", "company"])
         

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



