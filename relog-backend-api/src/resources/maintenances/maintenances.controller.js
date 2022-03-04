const _ = require("lodash");
const HttpStatus = require("http-status-codes");
const maintenance_service = require("./maintenances.service");
const rack_service = require("../racks/racks.service");
const family_service = require("../families/families.service");
const items_service = require("../racks_items/racks_items.service");
const logs_controller = require("../logs/logs.controller");
const jwt = require("jsonwebtoken");
const config = require("config");


exports.all = async (req, res) => {
   let all_maintenances = await maintenance_service.get_all();
   res.status(HttpStatus.OK).json(all_maintenances);
};

exports.create = async (req, res) => {
      const existing_rack = await rack_service.find_by_id(req.body.rack_id);
      if (!existing_rack) res.status(HttpStatus.BAD_REQUEST).send({ message: "Rack not found" });

      var maintenance_data = req.body      
      let token = extractToken(req)
      const decoded_payload = jwt.verify(token, config.get("security.jwtPrivateKey"))
      maintenance_data['user_id'] = decoded_payload._id

      var items = req.body.items
      for(var i in items){
         const existing_item = await items_service.find_by_id(items[i].item)
         if(!existing_item) res.status(HttpStatus.BAD_REQUEST).send({ message: "Item not found" })
         items[i]['price'] = existing_item.current_price
      }
      console.log("items", items)
      maintenance_data['items'] = items
      console.log("maintenance_data")

      const maintenance = await maintenance_service.create_maitenance(maintenance_data);
      logs_controller.create({ token: req.headers.authorization, log: "create_maitenance", newData: maintenance_data });
      res.status(HttpStatus.CREATED).send(maintenance);
};

exports.show = async (req, res) => {
   const maintenance = await maintenance_service.find_by_id(req.params.id);
   if (!maintenance) return res.status(HttpStatus.NOT_FOUND).send({ message: "Rack_item not found" });
   res.status(HttpStatus.OK).json(maintenance);
};

exports.update = async (req, res) => {
   let maintenance = await maintenance_service.find_by_id(req.params.id);
   if (!maintenance) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid rack item" });

   const existing_rack = await rack_service.find_by_id(req.body.rack_id);
   if (!existing_rack) res.status(HttpStatus.BAD_REQUEST).send({ message: "Rack not found" });

   var maintenance_data = req.body      
      let token = extractToken(req)
      const decoded_payload = jwt.verify(token, config.get("security.jwtPrivateKey"))
      maintenance_data['user_id'] = decoded_payload._id

      var items = req.body.items
      for(var i in items){
         const existing_item = await items_service.find_by_id(items[i].item)
         if(!existing_item) res.status(HttpStatus.BAD_REQUEST).send({ message: "Item not found" })
         items[i]['price'] = existing_item.current_price
      }
      console.log("items", items)
      maintenance_data['items'] = items
      console.log("maintenance_data")


   maintenance = await maintenance_service.update(req.params.id, maintenance_data);
   logs_controller.create({ token: req.headers.authorization, log: "update_maintenance", newData: maintenance });

   res.status(HttpStatus.CREATED).json(maintenance);
};

exports.get_time_report = async (req, res) => {
   const maintenance = await rack_service.find_by_id(req.params.id);
   if (!maintenance) return res.status(HttpStatus.NOT_FOUND).send({ message: "Rack not found" });
   
   const report = await maintenance_service.get_report(req.params.id)
   res.status(HttpStatus.OK).json(report)
};

exports.get_historic = async (req, res) => {
   var {start_date, end_date, family_id} = req.query

   const existing_family = await family_service.find_by_id(family_id)
   console.log("existring", existing_family)
   if(!existing_family) family_id = null

   const maintenances = await maintenance_service.get_historic({start_date, end_date, family_id})

   res.status(HttpStatus.OK).json(maintenances)
};

const extractToken = (req) => {
   let token = undefined;
   const authorization = req.header("Authorization");
   if (authorization) {
      const parts = authorization.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
         token = parts[1];
      } else {
         token = authorization;
      }
   }
   return token;
};