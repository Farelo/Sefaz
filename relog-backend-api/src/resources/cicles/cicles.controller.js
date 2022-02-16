process.setMaxListeners(0);
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const HttpStatus = require("http-status-codes");
const cicles_service = require("./cicles.service");
const logs_controller = require("../logs/logs.controller");

exports.all = async (req, res) => {
   const id = req.query.id ? req.query.id : null;
   const cicle = await cicles_service.get_cicles(id);

   res.json(cicle);
};

exports.show = async (req, res) => {
   const cicles = await cicles_service.get_cicles(req.params.id);

   if (!cicles) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid cicles" });

   res.json(cicles);
};

exports.update = async (req, res) => {
   let cicles = await cicles_service.find_by_id(req.params.id);
   if (!cicles) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid cicle" });

   cicles = await cicles_service.update_cicle(req.params.id, req.body);
   logs_controller.create({ token: req.headers.authorization, log: "update_cicle", newData: req.body });

   res.json(cicles);
};

exports.delete = async (req, res) => {
   const cicles = await cicles_service.find_by_id(req.params.id);
   if (!cicles) return res.status(HttpStatus.BAD_REQUEST).send({ message: "Invalid cicle" });

   await cicles.remove();
   await logs_controller.create({ token: req.headers.authorization, log: "delete_cicle", newData: cicles });

   return res.send({ message: "Delete successfully" });
};