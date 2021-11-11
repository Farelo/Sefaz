const debug = require("debug")("service:racks");
const _ = require("lodash");
const config = require("config");
const { Rack } = require("./racks.model");
const { Family } = require("../families/families.model");
const rp = require("request-promise");
const mongoose = require("mongoose");

exports.get_racks = async (tag, family) => {
   try {
      if (!tag) {
         if (family)
            return await Rack.find({ family: family })
               .populate("family", ["_id", "code", "company"])
               .populate("project", ["_id", "name"]);

         return await Rack.find()
            .populate("family", ["_id", "code", "company"])
            .populate("project", ["_id", "name"]);
      } 

      const data = await Rack.findByTag(tag)
         .populate("family", ["_id", "code", "company"])
         .populate("project", ["_id", "name"])
         .populate("last_position")
         .populate("last_battery")
         .populate("last_event_record")
         .populate("last_integration_record")
         .populate("last_alert_history");

      return data ? [data] : [];
   } catch (error) {
      throw new Error(error);
   }
};

exports.get_rack = async (id) => {
   try {
      const rack = await Rack.findById(id)
         .populate("family", ["_id", "code", "company"])
         .populate("project", ["_id", "name"])
         .populate("last_position")
         .populate("last_battery")
         .populate("last_event_record")
         .populate("last_integration_record")
         .populate("last_alert_history");

      return rack;
   } catch (error) {
      throw new Error(error);
   }
};

exports.find_by_tag = async (tag) => {
   try {
      return await Rack.findByTag(tag)
         .populate("family", ["_id", "code", "company"])
         .populate("project", ["_id", "name"]);
   } catch (error) {
      throw new Error(error);
   }
};


exports.findByFamilyAndSerial = async (familyId, serial) => {
  try {
     return await Rack.findOne({family: familyId, serial: serial})
        .populate("family", ["_id", "code", "company"])
        .populate("project", ["_id", "name"]);
  } catch (error) {
     throw new Error(error);
  }
};

exports.populatedFindByTag = async (tag) => {
   try {
      return await Rack.findByTag(tag)
         .populate("family", ["_id", "code", "company"])
         .populate("project", ["_id", "name"])
         .populate("last_position")
         .populate("last_battery")
         .populate("last_temperature")
   } catch (error) {
      throw new Error(error);
   }
};

exports.create_rack = async (rack) => {
   try {
      const new_rack = new Rack(rack);
      await new_rack.save();
      return new_rack;
   } catch (error) {
      throw new Error(error);
   }
};

exports.find_by_id = async (id) => {
   try {
      const rack = await Rack.findById(id)
         .populate("family", ["_id", "code", "company"])
         .populate("project", ["_id", "name"]);

      return rack;
   } catch (error) {
      throw new Error(error);
   }
};

exports.update_rack = async (id, rack_edited) => {
   try {
      const options = { runValidators: true, new: true };
      const rack = await Rack.findByIdAndUpdate(id, rack_edited, options);

      return rack;
   } catch (error) {
      throw new Error(error);
   }
};

exports.get_racks_on_control_point = async (control_point) => {
   try {
      const racks = await Rack.find({}).populate("last_event_record").populate("family", ["_id", "code"]);

      const data = racks.filter((rack) => rackOnControlPoint(rack, control_point));

      return data;
   } catch (error) {
      throw new Error(error);
   }
};

exports.check_device = async (device_id) => {
   try {
      const cookie = await loginLokaDmApi();
      const response = await deviceById(cookie, device_id);

      return response;
   } catch (error) {
      debug(error);
      throw new Error(error);
   }
};

exports.geolocation = async (query = { company_id: null, family_id: null, rack_serial: null }) => {
   try {
      let familiesIds = [];

      // console.log(query)

      if (query.company_id !== null) {
         familiesIds = await (await Family.find({ company: query.company_id })).map((f) => f._id);
      } else if (query.family_id !== null) {
         familiesIds.push(new mongoose.Types.ObjectId(query.family_id));
      }

      let conditions = {};

      conditions["active"] = true;

      if (familiesIds.length) {
         conditions["family"] = {
            $in: familiesIds,
         };
      }

      if (query.rack_serial !== null) {
         conditions["serial"] = {
            $eq: query.rack_serial,
         };
      }

      // console.log(conditions)
      return await Rack.find(conditions)
         .populate("last_position")
         .populate("last_battery")
         .populate("family", ["_id", "code"]);
   } catch (error) {
      throw new Error(error);
   }
};

const rackOnControlPoint = (rack, control_point) => {
   return rack.last_event_record && rack.last_event_record.type === "inbound"
      ? rack.last_event_record.control_point.toString() === control_point._id.toString()
      : false;
};

const loginLokaDmApi = async () => {
   const options = {
      method: "POST",
      uri: `${config.get("loka_api.baseUrl")}/auth/login`,
      headers: {
         "Content-type": "application/json",
      },
      body: {
         username: config.get("loka_api.username"),
         password: config.get("loka_api.password"),
      },
      resolveWithFullResponse: true,
      json: true,
   };

   try {
      const response = await rp(options);
      const cookie = response.headers["set-cookie"][0].split(";")[0];

      return cookie;
   } catch (error) {
      throw new Error(error);
   }
};

const deviceById = async (cookie, device_id) => {
   try {
      const options = {
         method: "GET",
         uri: `${config.get("loka_api.baseUrl")}/terminal/get/${device_id}`,
         headers: {
            "content-type": "application/json",
            Cookie: `${cookie}`,
            Connection: "close",
         },
         json: true,
      };

      const body = await rp(options);
      return body;
   } catch (error) {
      throw new Error(error);
   }
};
