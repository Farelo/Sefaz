const debug = require("debug")("controller:racks");
const HttpStatus = require("http-status-codes");
const racks_service = require("./packings.service");
const families_service = require("../families/families.service");
const projects_service = require("../projects/projects.service");
const control_points_service = require("../control_points/control_points.service");
const companies_service = require("../companies/companies.service");
const logs_controller = require("../logs/logs.controller");
const apiKeysService = require("../api_keys/api_keys.service");

const config = require("config");
const _ = require("lodash");
var https = require("https");
const axios = require("axios");

var token = "bb1ab275-2985-461b-8766-10c4b2c4127a";

exports.all = async (req, res) => {
    const tag = req.query.tag_code ? req.query.tag_code : null;
    const family = req.query.family ? req.query.family : null;
    const racks = await racks_service.get_racks(tag, family);
 
    res.json(racks);
 };

 exports.show = async (req, res) => {
    const rack = await packings_service.get_racks(req.params.id);
 
    if (!rack) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid rack" });
 
    res.json(rack);
 };

 exports.create = async (req, res) => {
    let rack = await racks_service.find_by_tag(req.body.tag.code);
    if (rack) return res.status(HttpStatus.BAD_REQUEST).send({ message: "Rack already exists with this code." });
 
    const family = await families_service.find_by_id(req.body.family);
    if (!family) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid family." });
 
    if (req.body.project) {
       const project = await projects_service.find_by_id(req.body.project);
       if (!project) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid project." });
    }
 
    rack = await racks_service.create_rack(req.body);
 
    logs_controller.create({ token: req.headers.authorization, log: "create_rack", newData: req.body });
 
    res.status(HttpStatus.CREATED).send(rack);
 };

 