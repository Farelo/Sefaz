process.setMaxListeners(0);
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const HttpStatus = require("http-status-codes");
const cicles_service = require("./cicles.service");
const logs_controller = require("../logs/logs.controller");

exports.all = async (req, res) => {
   const serial = req.query.serial ? req.query.serial : null;
   const cicles = await cicles_service.get_cicles(serial);

   res.json(engines);
};

exports.show = async (req, res) => {
   const engine = await engines_service.get_engine(req.params.id);

   if (!engine) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid engine" });

   res.json(engine);
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