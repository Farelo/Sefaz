process.setMaxListeners(0);
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const debug = require("debug")("controller:packings");
const HttpStatus = require("http-status-codes");
const packings_service = require("./packings.service");
const families_service = require("../families/families.service");
const projects_service = require("../projects/projects.service");
const control_points_service = require("../control_points/control_points.service");
const companies_service = require("../companies/companies.service");
var https = require("https");
const utils = require('../../common/utils')

var token = "bb1ab275-2985-461b-8766-10c4b2c4127a";

exports.all = async (req, res) => {
  const tag = req.query.tag_code ? { code: req.query.tag_code } : null;
  const family = req.query.family ? req.query.family : null;
  const packings = await packings_service.get_packings(tag, family);

  res.json(packings);
};

exports.show = async (req, res) => {
  const packing = await packings_service.get_packing(req.params.id);

  if (!packing)
    return res
      .status(HttpStatus.NOT_FOUND)
      .send({ message: "Invalid packing" });

  res.json(packing);
};

exports.create = async (req, res) => {
  let packing = await packings_service.find_by_tag(req.body.tag);
  if (packing)
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send({ message: "Packing already exists with this code." });

  const family = await families_service.find_by_id(req.body.family);
  if (!family)
    return res
      .status(HttpStatus.NOT_FOUND)
      .send({ message: "Invalid family." });

  if (req.body.project) {
    const project = await projects_service.find_by_id(req.body.project);
    if (!project)
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({ message: "Invalid project." });
  }

  packing = await packings_service.create_packing(req.body);

  //Sub packing in websocket
  await subPacking(packing.tag.code);
  res.status(HttpStatus.CREATED).send(packing);
};

async function subPacking(id) {
  var optionsget = {
    host: "core.loka.systems",
    port: 443,
    path: "/subscribe_terminal/" + id,
    method: "GET",
    headers: { Authorization: "Bearer " + token }
  };

  await requestSubscribe(optionsget);
}

function requestSubscribe(optionsget) {
  console.log(optionsget);

  return new Promise((resolve, reject) => {
    var reqGet = https.request(optionsget, function(res) {
      res.on("data", function(d) {
        console.log("GET result:\n" + d);
        resolve(d);
      });
    });

    reqGet.end();
    reqGet.on("error", function(e) {
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
    headers: { Authorization: "Bearer " + token }
  };
  await requestUnsubscribe(optionsget);
}

function requestUnsubscribe(optionsget) {
  return new Promise((resolve, reject) => {
    var reqGet = https.request(optionsget, function(res) {
      res.on("data", function(d) {
        console.log("GET result:\n" + d);
        resolve(d);
      });
    });

    reqGet.end();
    reqGet.on("error", function(e) {
      console.log(e);
      reject(e);
    });
  });
}

exports.create_many = async (req, res) => {
  let packings = [];

  for (let packing of req.body) {
    let current_packing = await packings_service.find_by_tag(packing.data.tag);
    if (current_packing)
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: `Packing already exists with this code ${packing.data.tag.code}.`
      });

    const family = await families_service.find_by_id(packing.data.family._id);
    if (!family)
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({ message: `Invalid family ${packing.data.family}.` });

    if (packing.data.project) {
      const project = await projects_service.find_by_id(packing.data.project);
      if (!project)
        return res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: `Invalid project ${packing.data.project}.` });
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
  if (!packing)
    return res
      .status(HttpStatus.NOT_FOUND)
      .send({ message: "Invalid packing" });

  packing = await packings_service.update_packing(req.params.id, req.body);

  res.json(packing);
};

exports.delete = async (req, res) => {
  const packing = await packings_service.find_by_id(req.params.id);
  if (!packing)
    res.status(HttpStatus.BAD_REQUEST).send({ message: "Invalid packing" });

  let code = packing.tag.code;

  await packing.remove();

  await unsubPacking(packing.tag.code);

  res.send({ message: "Delete successfully" });
};

exports.show_packings_on_control_point = async (req, res) => {
  const { control_point_id } = req.params;

  const control_point = await control_points_service.get_control_point(
    control_point_id
  );
  if (!control_point)
    return res.status(HttpStatus.NOT_FOUND).send("Invalid company");

  const data = await packings_service.get_packings_on_control_point(
    control_point
  );

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
        packing_serial: req.query.packing_serial ? req.query.packing_serial : null
    }

    if (req.query.family_id) {
        const family = await families_service.get_family(req.query.family_id)
        if (!family) return res.status(HttpStatus.NOT_FOUND).send('Invalid family')
    }

    if (req.query.company_id) {
        const company = await companies_service.get_company(req.query.company_id)
        if (!company) return res.status(HttpStatus.NOT_FOUND).send('Invalid company')
    }

    const packings = await packings_service.geolocation(query)

    res.json(packings)
}

exports.control_point_geolocation = async (req, res) => {
    const query = {
        start_date: req.query.start_date ? req.query.start_date : null,
        end_date: req.query.end_date ? req.query.end_date : null,
        date: req.query.date ? req.query.date : null,
        last_hours: req.query.last_hours ? req.query.last_hours : null,
        // company_type: req.query.company_type ? req.query.company_type : null,
        company_id: req.query.company_id ? req.query.company_id : null,
        control_point_type: req.query.control_point_type ? req.query.control_point_type : null,
        control_point_id: req.query.control_point_id ? req.query.control_point_id : null,
        family_id: req.query.family_id ? req.query.family_id : null,
        serial: req.query.serial ? req.query.serial : null, 
        current_state: req.query.selectedStatus ? req.query.selectedStatus : null,
        only_good_accuracy: req.query.onlyGoodAccuracy ? req.query.onlyGoodAccuracy : false
    }

    if (query.start_date != null && !utils.is_valid_date(query.start_date)) {
        return res.status(HttpStatus.NOT_FOUND).send('Invalid date')
    }

    if (query.end_date != null && !utils.is_valid_date(query.end_date)) {
        return res.status(HttpStatus.NOT_FOUND).send('Invalid date')
    }

    if (query.date != null && !utils.is_valid_date(query.date)) {
        return res.status(HttpStatus.NOT_FOUND).send('Invalid date')
    }

    if (req.query.company_id) {
        const company = await companies_service.get_company(req.query.company_id)
        if (!company) return res.status(HttpStatus.NOT_FOUND).send('Invalid company')
    }

    if (req.query.family_id) {
        const family = await families_service.get_family(req.query.family_id)
        if (!family) return res.status(HttpStatus.NOT_FOUND).send('Invalid family')
    }

    if (req.query.serial) {
        const packings = await packings_service.find_by_serial(req.query.serial)
        if (!packings.length) return res.status(HttpStatus.NOT_FOUND).send('Invalid packings')
    }

    const packings = await packings_service.control_point_geolocation(query)

    res.json(packings)
}
