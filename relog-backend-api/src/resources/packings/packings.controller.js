process.setMaxListeners(0);
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const debug = require("debug")("controller:packings");
const HttpStatus = require("http-status-codes");
const packings_service = require("./packings.service");
const families_service = require("../families/families.service");
const projects_service = require("../projects/projects.service");
const control_points_service = require("../control_points/control_points.service");
const companies_service = require("../companies/companies.service");
const apiKeysService = require("../api_keys/api_keys.service");

const config = require("config");
const _ = require("lodash");
var https = require("https");
const axios = require("axios");

var token = "bb1ab275-2985-461b-8766-10c4b2c4127a";

exports.all = async (req, res) => {
   const tag = req.query.tag_code ? req.query.tag_code : null;
   const family = req.query.family ? req.query.family : null;
   const packings = await packings_service.get_packings(tag, family);

   res.json(packings);
};

exports.show = async (req, res) => {
   const packing = await packings_service.get_packing(req.params.id);

   if (!packing) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid packing" });

   res.json(packing);
};

exports.create = async (req, res) => {
   let packing = await packings_service.find_by_tag(req.body.tag.code);
   if (packing) return res.status(HttpStatus.BAD_REQUEST).send({ message: "Packing already exists with this code." });

   const family = await families_service.find_by_id(req.body.family);
   if (!family) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid family." });

   if (req.body.project) {
      const project = await projects_service.find_by_id(req.body.project);
      if (!project) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid project." });
   }

   packing = await packings_service.create_packing(req.body);

   //Create on callback proxy
   // let proxyApiKey = await apiKeysService.findByName("proxy-ayga");
   // if (proxyApiKey.length) await createOnProxy(packing, proxyApiKey[0]);

   //Sub packing in websocket
   await subPacking(packing.tag.code);

   res.status(HttpStatus.CREATED).send(packing);
};
 
const createOnProxy = async (packing, proxyApiKey) => {
   console.log(' ');
   console.log('createOnProxy');
   console.log(packing);
   console.log(proxyApiKey);

   let response = await axios.post(
      config.get("proxyAyga.url"),
      { tag: packing.tag.code, client: config.get("proxyAyga.clientName") },
      {
         headers: {
            APIKEY: proxyApiKey.key,
         },
      }
   );
   console.log(response);
};

async function subPacking(id) {
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

async function unsubPacking(id) {
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
   let packings = [];

   for (let packing of req.body) {
      let current_packing = await packings_service.find_by_tag(packing.data.tag.code);
      if (current_packing)
         return res.status(HttpStatus.BAD_REQUEST).send({
            message: `Packing already exists with this code ${packing.data.tag.code}.`,
         });

      const family = await families_service.find_by_id(packing.data.family._id);
      if (!family) return res.status(HttpStatus.NOT_FOUND).send({ message: `Invalid family ${packing.data.family}.` });

      if (packing.data.project) {
         const project = await projects_service.find_by_id(packing.data.project);
         if (!project)
            return res.status(HttpStatus.NOT_FOUND).send({ message: `Invalid project ${packing.data.project}.` });
      }

      packing.data.active = true;

      current_packing = await packings_service.create_packing(packing.data);
      await subPacking(current_packing.tag.code);
      packings.push(current_packing);
   }

   res.status(HttpStatus.CREATED).send(packings);
};

exports.update = async (req, res) => {
   let packing = await packings_service.find_by_id(req.params.id);
   if (!packing) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid packing" });

   packing = await packings_service.update_packing(req.params.id, req.body);

   res.json(packing);
};

exports.delete = async (req, res) => {
   const packing = await packings_service.find_by_id(req.params.id);
   if (!packing) res.status(HttpStatus.BAD_REQUEST).send({ message: "Invalid packing" });

   let code = packing.tag.code;

   await packing.remove();

   await unsubPacking(packing.tag.code);

   res.send({ message: "Delete successfully" });
};

exports.show_packings_on_control_point = async (req, res) => {
   const { control_point_id } = req.params;

   const control_point = await control_points_service.get_control_point(control_point_id);
   if (!control_point) return res.status(HttpStatus.NOT_FOUND).send("Invalid company");

   const data = await packings_service.get_packings_on_control_point(control_point);

   res.json(data);
};

exports.check_device = async (req, res) => {
   const { device_id } = req.params;

   const data = await packings_service.check_device(device_id);

   res.json(data);
};

exports.geolocation = async (req, res) => {
   const query = {
      company_id: req.query.company_id ? req.query.company_id : null,
      family_id: req.query.family_id ? req.query.family_id : null,
      packing_serial: req.query.packing_serial ? req.query.packing_serial : null,
   };

   if (req.query.family_id) {
      const family = await families_service.get_family(req.query.family_id);
      if (!family) return res.status(HttpStatus.NOT_FOUND).send("Invalid family");
   }

   if (req.query.company_id) {
      const company = await companies_service.get_company(req.query.company_id);
      if (!company) return res.status(HttpStatus.NOT_FOUND).send("Invalid company");
   }

   let packings = await packings_service.geolocation(query);
   packings = packings.map((elem) => {
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

   res.json(packings);
};
