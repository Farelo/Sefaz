process.setMaxListeners(0);
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const debug = require("debug")("controller:engines");
const HttpStatus = require("http-status-codes");
const engines_service = require("./engines.service");
const engine_types_service = require("../engine_types/engine_types.service");
const projects_service = require("../projects/projects.service");
const logs_controller = require("../logs/logs.controller");
const apiKeysService = require("../api_keys/api_keys.service");

const config = require("config");
const _ = require("lodash");
var https = require("https");
const axios = require("axios");

var token = "bb1ab275-2985-461b-8766-10c4b2c4127a";

exports.all = async (req, res) => {
   const tag = req.query.tag_code ? req.query.tag_code : null;
   const engine_type = req.query.engine_type ? req.query.engine_type : null;
   const engines = await engines_service.get_engines(tag, engine_type);

   res.json(engines);
};

exports.show = async (req, res) => {
   const engine = await engines_service.get_engine(req.params.id);

   if (!engine) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid engine" });

   res.json(engine);
};

exports.create = async (req, res) => {
   let engine = await engines_service.find_by_tag(req.body.tag.code);
   if (engine) return res.status(HttpStatus.BAD_REQUEST).send({ message: "Engine already exists with this code." });

   const engine_type = await engine_types_service.find_by_id(req.body.engine_type);
   if (!engine_type) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid engine_types." });


   engine = await engines_service.create_engine(req.body);

   logs_controller.create({ token: req.headers.authorization, log: "create_engine", newData: req.body });

   res.status(HttpStatus.CREATED).send(engine);
};


exports.create_many = async (req, res) => {
   let engines = [];

   for (let engine of req.body) {
      let current_engine = await engines_service.find_by_tag(engine.data.tag.code);
      if (current_engine)
         return res.status(HttpStatus.BAD_REQUEST).send({
            message: `Engine already exists with this code ${engine.data.tag.code}.`,
         });

      const engine_type = await engine_types_service.find_by_id(engine.data.engine_type._id);
      if (!engine_type) return res.status(HttpStatus.NOT_FOUND).send({ message: `Invalid engine_type ${engine.data.engine_type}.` });


      engine.data.active = true;

      current_engine = await engines_service.create_engine(engine.data);

      logs_controller.create({
         token: req.headers.authorization,
         log: "create_engine_many",
         newData: current_engine,
      });
     
      engines.push(current_engine);
   }

   res.status(HttpStatus.CREATED).send(engines);
};

exports.update = async (req, res) => {
   let engine = await engines_service.find_by_id(req.params.id);
   if (!engine) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid engine" });

   engine = await engines_service.update_engine(req.params.id, req.body);
   logs_controller.create({ token: req.headers.authorization, log: "update_engine", newData: req.body });

   res.json(engine);
};

exports.delete = async (req, res) => {
   const engine = await engines_service.find_by_id(req.params.id);
   if (!engine) return res.status(HttpStatus.BAD_REQUEST).send({ message: "Invalid engine" });

   await engine.remove();
   await logs_controller.create({ token: req.headers.authorization, log: "delete_engine", newData: engine });

  

   return res.send({ message: "Delete successfully" });
};