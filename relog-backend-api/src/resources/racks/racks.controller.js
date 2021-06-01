process.setMaxListeners(0);
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const debug = require("debug")("controller:racks");
const HttpStatus = require("http-status-codes");
const racks_service = require("./racks.service");
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
   const rack = await racks_service.get_rack(req.params.id);

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
   //Create on callback proxy
   // let proxyApiKey = await apiKeysService.findByName("proxy-ayga");
   // if (proxyApiKey.length) await createOnProxy(rack, proxyApiKey[0]);

   //Sub rack in websocket
   // await subRack(rack.tag.code);

   res.status(HttpStatus.CREATED).send(rack);
};

const createOnProxy = async (rack, proxyApiKey) => {
   console.log(" ");
   console.log("createOnProxy");
   console.log(rack);
   console.log(proxyApiKey);

   let response = await axios.post(
      config.get("proxyAyga.url"),
      { tag: rack.tag.code, client: config.get("proxyAyga.clientName") },
      {
         headers: {
            APIKEY: proxyApiKey.key,
         },
      }
   );
   console.log(response);
};

async function subRack(id) {
   var optionsget = {
      host: "core.loka.systems",
      port: 443,
      path: "/subscribe_terminal/" + id,
      method: "GET",
      headers: { Authorization: "Bearer " + token },
   };

   await requestSubscribe(optionsget);
}

function requestSubscribe(optionsget) {
   console.log(optionsget);

   return new Promise((resolve, reject) => {
      var reqGet = https.request(optionsget, function (res) {
         res.on("data", function (d) {
            console.log("GET result:\n" + d);
            resolve(d);
         });
      });

      reqGet.end();
      reqGet.on("error", function (e) {
         console.log(e);
         reject(e);
      });
   });
}

async function unsubRack(id) {
   var optionsget = {
      host: "core.loka.systems",
      port: 443,
      path: "/unsubscribe_terminal/" + id,
      method: "GET",
      headers: { Authorization: "Bearer " + token },
   };
   await requestUnsubscribe(optionsget);
}

function requestUnsubscribe(optionsget) {
   return new Promise((resolve, reject) => {
      var reqGet = https.request(optionsget, function (res) {
         res.on("data", function (d) {
            console.log("GET result:\n" + d);
            resolve(d);
         });
      });

      reqGet.end();
      reqGet.on("error", function (e) {
         console.log(e);
         reject(e);
      });
   });
}

exports.create_many = async (req, res) => {
   let racks = [];

   for (let rack of req.body) {
      let current_rack = await racks_service.find_by_tag(rack.data.tag.code);
      if (current_rack)
         return res.status(HttpStatus.BAD_REQUEST).send({
            message: `Rack already exists with this code ${rack.data.tag.code}.`,
         });

      const family = await families_service.find_by_id(rack.data.family._id);
      if (!family) return res.status(HttpStatus.NOT_FOUND).send({ message: `Invalid family ${rack.data.family}.` });

      if (rack.data.project) {
         const project = await projects_service.find_by_id(rack.data.project);
         if (!project)
            return res.status(HttpStatus.NOT_FOUND).send({ message: `Invalid project ${rack.data.project}.` });
      }

      rack.data.active = true;

      current_rack = await racks_service.create_rack(rack.data);

      logs_controller.create({
         token: req.headers.authorization,
         log: "create_rack_many",
         newData: current_rack,
      });
      // await subRack(current_rack.tag.code);
      racks.push(current_rack);
   }

   res.status(HttpStatus.CREATED).send(racks);
};

exports.update = async (req, res) => {
   let rack = await racks_service.find_by_id(req.params.id);
   if (!rack) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid rack" });

   rack = await racks_service.update_rack(req.params.id, req.body);
   logs_controller.create({ token: req.headers.authorization, log: "update_rack", newData: req.body });

   res.json(rack);
};

exports.delete = async (req, res) => {
   const rack = await racks_service.find_by_id(req.params.id);
   if (!rack) return res.status(HttpStatus.BAD_REQUEST).send({ message: "Invalid rack" });

   await rack.remove();
   await logs_controller.create({ token: req.headers.authorization, log: "delete_rack", newData: rack });

   // await unsubRack(rack.tag.code);

   return res.send({ message: "Delete successfully" });
};

exports.show_racks_on_control_point = async (req, res) => {
   const { control_point_id } = req.params;

   const control_point = await control_points_service.get_control_point(control_point_id);
   if (!control_point) return res.status(HttpStatus.NOT_FOUND).send("Invalid company");

   const data = await racks_service.get_racks_on_control_point(control_point);

   res.json(data);
};

exports.check_device = async (req, res) => {
   const { device_id } = req.params;

   const data = await racks_service.check_device(device_id);

   res.json(data);
};

exports.geolocation = async (req, res) => {
   const query = {
      company_id: req.query.company_id ? req.query.company_id : null,
      family_id: req.query.family_id ? req.query.family_id : null,
      rack_serial: req.query.rack_serial ? req.query.rack_serial : null,
   };

   if (req.query.family_id) {
      const family = await families_service.get_family(req.query.family_id);
      if (!family) return res.status(HttpStatus.NOT_FOUND).send("Invalid family");
   }

   if (req.query.company_id) {
      const company = await companies_service.get_company(req.query.company_id);
      if (!company) return res.status(HttpStatus.NOT_FOUND).send("Invalid company");
   }

   let racks = await racks_service.geolocation(query);
   racks = racks.map((elem) => {
      let newObj = _.pick(elem, ["family", "serial", "tag", "last_position", "last_battery", "current_state"]);

      if (newObj.last_position)
         newObj.last_position = _.pick(newObj.last_position, [
            "accuracy",
            "battery",
            "latitude",
            "longitude",
            "date",
            "timestamp",
         ]);
      if (newObj.last_battery)
         newObj.last_battery = _.pick(newObj.last_battery, ["date", "timestamp", "battery", "batteryVoltage"]);

      newObj.tag = _.pick(newObj.tag, ["code"]);
      return newObj;
   });

   res.json(racks);
};
