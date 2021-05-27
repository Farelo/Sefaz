const debug = require("debug")("controller:engines");
const HttpStatus = require("http-status-codes");
const engines_service = require("./packings.service");
const families_service = require("../families/families.service");
const projects_service = require("../projects/projects.service");
const logs_controller = require("../logs/logs.controller");


const config = require("config");
const _ = require("lodash");
var https = require("https");
const axios = require("axios");

var token = "bb1ab275-2985-461b-8766-10c4b2c4127a";

exports.all = async (req, res) => {
    const tag = req.query.tag_code ? req.query.tag_code : null;
    const family = req.query.family ? req.query.family : null;
    const engines = await engines_service.get_engines(tag, family);
 
    res.json(engines);
 };

 exports.show = async (req, res) => {
    const engine = await engines_service.get_engines(req.params.id);
 
    if (!engine) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid engine" });
 
    res.json(engine);
 };

 exports.create = async (req, res) => {
    let engine = await engines_service.find_by_tag(req.body.tag.code);
    if (engine) return res.status(HttpStatus.BAD_REQUEST).send({ message: "Engine already exists with this code." });
 
    const family = await families_service.find_by_id(req.body.family);
    if (!family) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid family." });
 
    if (req.body.project) {
       const project = await projects_service.find_by_id(req.body.project);
       if (!project) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid project." });
    }
 
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

      const family = await families_service.find_by_id(engine.data.family._id);
      if (!family) return res.status(HttpStatus.NOT_FOUND).send({ message: `Invalid family ${engine.data.family}.` });

      if (engine.data.project) {
         const project = await projects_service.find_by_id(engine.data.project);
         if (!project)
            return res.status(HttpStatus.NOT_FOUND).send({ message: `Invalid project ${engine.data.project}.` });
      }

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
   const engine = await families_service.find_by_id(req.params.id)
   if (!engine) res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid engine' })

   
   logs_controller.create({token:req.headers.authorization, log:'delete_engine' , newData:engine});
   await engine.remove()

   res.send({ message: 'Delete successfully' })
}

