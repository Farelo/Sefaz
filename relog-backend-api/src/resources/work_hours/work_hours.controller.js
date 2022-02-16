const HttpStatus = require("http-status-codes");
//const {work_hour} = require("./work_hours.model");
const work_hours_service = require("./work_hours.service");



exports.all = async (req, res) => {
  const id = req.query.id ? req.query.id : null;
  const work_hour = await work_hours_service.get_work_hours(id);

  res.json(work_hour);
};

exports.update = async (req, res) => {
  let work_hour = await work_hours_service.find_by_id(req.id);
  if (!work_hour) return res.status(HttpStatus.NOT_FOUND).send({ message: "Invalid work_hour" });
   
  work_hour = await work_hours_service.update_work_hour(req.params.id, req.body);
  logs_controller.create({ token: req.headers.authorization, log: "update_work_hour", newData: req.body });

  res.json(work_hour);
};

exports.delete = async (req, res) => {
  const work_hour = await work_hours_service.find_by_id(req.id);
  if (!work_hour) return res.status(HttpStatus.BAD_REQUEST).send({ message: "Invalid work_hour" });

  await work_hour.remove();
  await logs_controller.create({ token: req.headers.authorization, log: "delete_work_hour", newData: work_hour });

  return res.send({ message: "Delete successfully" });
};