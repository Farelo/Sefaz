const debug = require("debug")("controller:control_points");
const HttpStatus = require("http-status-codes");
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");
const settings_service = require("./settings.service");
const logs_controller = require("../logs/logs.controller");

exports.show = async (req, res) => {
   console.log("show settings");
   let setting = await settings_service.get_setting(req.params.id);
   if (!setting) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid setting." });

   let token = extractToken(req);
   const decoded_payload = jwt.verify(token, config.get("security.jwtPrivateKey"));

   let newSetting = JSON.parse(JSON.stringify(setting));
   
   if (decoded_payload.role !== "masterAdmin") {
      delete newSetting.expiration_date;
   }

   res.json(newSetting);
};

exports.update = async (req, res) => {
   let setting = await settings_service.find_by_id(req.params.id);
   if (!setting) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid setting." });

   if (req.body.expiration_date) {
      let token = extractToken(req);
      const decoded_payload = jwt.verify(token, config.get("security.jwtPrivateKey"));
      if (decoded_payload.role !== "masterAdmin") delete req.body.expiration_date;
   }

   setting = await settings_service.update_setting(req.params.id, req.body);

   logs_controller.create({ token: req.headers.authorization, log: "settings_update", newData: setting });
   res.json(setting);
};

const extractToken = (req) => {
   // Authorization: Bearer TOKEN
   let token = undefined;
   const authorization = req.header("Authorization");

   if (authorization) {
      // token = authorization
      const parts = authorization.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
         token = parts[1];
      } else {
         token = authorization;
      }
   }
   return token;
};
