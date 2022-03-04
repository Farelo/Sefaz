const _ = require("lodash");
const HttpStatus = require("http-status-codes");
const config = require("config");
const rack_item_service = require("./racks_items.service");
const price_service = require("../prices/prices.service");
const families_service = require("../families/families.service");
const logs_controller = require("../logs/logs.controller");
const debug = require("debug")("controller:rack_items");
var https = require("https");

exports.all = async (req, res) => {

   const { startDate, endDate } = req.query;
   let all_items = await rack_item_service.get_all_rack_items({ startDate, endDate });

   res.status(HttpStatus.OK).json(all_items);
};

exports.create = async (req, res) => {
   console.log("create rack item");
   const {name, description, current_price, date } = req.body

      const existingItem = await rack_item_service.find_by_name(name);
      if (existingItem) res.status(HttpStatus.BAD_REQUEST).send({ message: "Name already exists" });

      const rack_item = await rack_item_service.create_rack_item({name, description});
      const price = {
         item_id: rack_item._id,
         cost: current_price,
         date: date
      }
      
      const new_price = await price_service.create_price(price)

      const updated_rack_item = await rack_item_service.update_rack_item_price(rack_item._id, new_price._id)
     
      logs_controller.create({ token: req.headers.authorization, log: "create_rack", newData: req.body });

      res.status(HttpStatus.CREATED).send(updated_rack_item);
   
};

exports.show = async (req, res) => {
   const rack_item = await rack_item_service.find_by_id(req.params.id);
   if (!rack_item) return res.status(HttpStatus.NOT_FOUND).send({ message: "Rack_item not found" });
   res.status(HttpStatus.OK).json(rack_item);
};

exports.update = async (req, res) => {
   let rack_item = await rack_item_service.find_by_id(req.params.id);
   if (!rack_item) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid rack item" });

   const existingItem = await rack_item_service.find_by_name(req.body.name);
   if (existingItem) res.status(HttpStatus.BAD_REQUEST).send({ message: "Name already exists" });

   rack_item = await rack_item_service.update_rack_item(req.params.id, req.body);
   logs_controller.create({ token: req.headers.authorization, log: "update_rack_item", newData: rack_item });

   res.status(HttpStatus.CREATED).json(rack_item);
};

exports.update_price = async (req, res) => {
   let rack_item = await rack_item_service.find_by_id(req.params.id);
   if (!rack_item) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid rack item" });

   const price = {
      item_id: rack_item._id,
      cost: req.body.current_price,
      date: req.body.date
   }

   const new_price = await price_service.create_price(price)
 
   rack_item = await rack_item_service.update_current_price(req.params.id, new_price._id);
   logs_controller.create({ token: req.headers.authorization, log: "update_rack_item", newData: rack_item });

   res.status(HttpStatus.CREATED).json(rack_item);
};

exports.delete = async (req, res) => {
   var rack_item = await rack_item_service.find_by_id(req.params.id);
   if (!rack_item) res.status(HttpStatus.BAD_REQUEST).send({ message: "Invalid rack item" });

   logs_controller.create({ token: req.headers.authorization, log: "delete_rack_item", newData: rack_item });
   req.body['excluded_at'] = Date.now();
   console.log("req body", req.body)
   rack_item = await rack_item_service.delete_rack_item(req.params.id, req.body)

   res.status(HttpStatus.OK).json({ message: "Delete successfully" });
};

exports.get_prices = async (req, res) => {
   const { startDate, endDate } = req.query;
   const rack_item = await rack_item_service.get_price_history(req.params.id, startDate, endDate);
   if (!rack_item) return res.status(HttpStatus.NOT_FOUND).send({ message: "Rack_item not found" });
   res.status(HttpStatus.OK).json(rack_item);
};