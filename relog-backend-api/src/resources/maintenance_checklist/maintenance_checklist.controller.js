const _ = require("lodash");
const HttpStatus = require("http-status-codes");
const config = require("config");
const maintenance_checklist_service = require("./maintenance_checklist.service");
const logs_controller = require("../logs/logs.controller");
var https = require("https");


exports.create = async (req, res) => {
 
   if (req.body) {
      const checklist = await maintenance_checklist_service.create_maintenance_checklist(req.body);

      res.status(HttpStatus.CREATED).send(checklist);
   }
};

exports.show = async (req, res) => {
   const maintenance_checklist = await maintenance_checklist_service.find_by_id(req.params.id);
   if (!maintenance_checklist) return res.status(HttpStatus.NOT_FOUND).send({ message: "Checklist not found" });
   res.status(HttpStatus.OK).json(maintenance_checklist);
};
