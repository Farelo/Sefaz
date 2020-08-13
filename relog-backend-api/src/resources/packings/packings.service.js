const debug = require("debug")("service:packings");
const _ = require("lodash");
const config = require("config");
const { Packing } = require("./packings.model");
const { Family } = require("../families/families.model");
const { Company } = require("../companies/companies.model");
const { EventRecord } = require("../event_record/event_record.model");
const { Setting } = require("../settings/settings.model");
const { ControlPoint } = require("../control_points/control_points.model");
const { ControlPoint } = require("../control_points/control_points.model");
const rp = require("request-promise");
const mongoose = require("mongoose");
const moment = require("moment");

exports.get_packings = async (tag, family) => {
   try {
      if (!tag) {
         if (family)
            return await Packing.find({ family: family })
               .populate("family", ["_id", "code", "company"])
               .populate("project", ["_id", "name"]);

         return await Packing.find()
            .populate("family", ["_id", "code", "company"])
            .populate("project", ["_id", "name"]);
      }

      const data = await Packing.findByTag(tag)
         .populate("family", ["_id", "code", "company"])
         .populate("project", ["_id", "name"])
         .populate("last_device_data")
         .populate("last_device_data_battery")
         .populate("last_event_record")
         .populate("last_alert_history");

      return data ? [data] : [];
   } catch (error) {
      throw new Error(error);
   }
};

exports.get_packing = async (id) => {
   try {
      const packing = await Packing.findById(id)
         .populate("family", ["_id", "code", "company"])
         .populate("project", ["_id", "name"])
         .populate("last_device_data")
         .populate("last_device_data_battery")
         .populate("last_event_record")
         .populate("last_alert_history");

      return packing;
   } catch (error) {
      throw new Error(error);
   }
};

exports.find_by_tag = async (tag) => {
   try {
      const packing = await Packing.findByTag(tag)
         .populate("family", ["_id", "code", "company"])
         .populate("project", ["_id", "name"]);

      return packing;
   } catch (error) {
      throw new Error(error);
   }
};

exports.find_by_serial = async (serial) => {
   try {
      const packings = await Packing.find({ serial });

      return packings;
   } catch (error) {
      throw new Error(error);
   }
};

exports.create_packing = async (packing) => {
   try {
      const new_packing = new Packing(packing);
      await new_packing.save();

      return new_packing;
   } catch (error) {
      throw new Error(error);
   }
};

exports.find_by_id = async (id) => {
   try {
      const packing = await Packing.findById(id)
         .populate("family", ["_id", "code", "company"])
         .populate("project", ["_id", "name"]);

      return packing;
   } catch (error) {
      throw new Error(error);
   }
};

exports.update_packing = async (id, packing_edited) => {
   try {
      const options = { runValidators: true, new: true };
      const packing = await Packing.findByIdAndUpdate(id, packing_edited, options);

      return packing;
   } catch (error) {
      throw new Error(error);
   }
};

exports.get_packings_on_control_point = async (control_point) => {
   try {
      const packings = await Packing.find({}).populate("last_event_record").populate("family", ["_id", "code"]);

      const data = packings.filter((packing) => packingOnControlPoint(packing, control_point));

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

exports.geolocation = async (query = { company_id: null, family_id: null, packing_serial: null }) => {
   try {
      let familiesIds = [];

      if (query.company_id != null) {
         familiesIds = await (await Family.find({ company: query.company_id })).map((f) => f._id);
      } else if (query.family_id != null) {
         familiesIds.push(new mongoose.Types.ObjectId(query.family_id));
      }

      let conditions = {};

      if (familiesIds.length) {
         conditions["family"] = {
            $in: familiesIds,
         };
      }

      if (query.packing_serial != null) {
         conditions["serial"] = {
            $eq: query.packing_serial,
         };
      }

      return await Packing.find(conditions)
         .populate("last_device_data")
         .populate("last_device_data_battery")
         .populate("family");
   } catch (error) {
      throw new Error(error);
   }
};

exports.control_point_geolocation = async (query) => {
   try {
      const settings = await Setting.find({});

      let date_conditions = {};
      let finalQuery = {};

      if (query.start_date != null && query.end_date) {
         date_conditions = {
            $gte: new Date(query.start_date),
            $lte: new Date(query.end_date),
         };
      } else if (query.date != null) {
         let date = new Date();
         date_conditions = {
            $gte: new Date(moment(query.date).utc().hour(0).minute(0).second(0)),
            $lte: new Date(moment(query.date).utc().hour(23).minute(59).second(59)), //new Date(date.setDate(query.date + 1)),
         };
      } else if (query.last_hours) {
         let last_hours = parseInt(query.last_hours, 10);
         date_conditions = {
            $gte: new Date(moment().subtract(last_hours + 3, "h")),
         };
      }

      // start_date: req.query.start_date ? req.query.start_date : null,
      // end_date: req.query.end_date ? req.query.end_date : null,
      // date: req.query.date ? req.query.date : null,
      // last_hours: req.query.last_hours ? req.query.last_hours : null,
      if (!_.isEmpty(date_conditions)) {
         if (query.control_point_id !== null || query.control_point_type !== null)
            finalQuery["eventrecord.created_at"] = date_conditions;
         else finalQuery["devicedata.message_date"] = date_conditions;
      }

      
      // Controlpoint ID e Controlpoint Type
      // Se informou os dois não importa, pois o front filtra os PC desse tipo. Basta apenas considerar o PC
      
      // control_point_id: req.query.control_point_id ? req.query.control_point_id : null,
      // control_point_type: req.query.control_point_type ? req.query.control_point_type : null,
      if (query.control_point_id !== null) {
        finalQuery["eventrecord.control_point"] = new mongoose.Types.ObjectId(query.control_point_id);
        } else if (query.control_point_type !== null) {
            await ControlPoint.find({ type: query.control_point_type }, { _id: 1 }, (err, typed_control_points) => {
                let control_points = typed_control_points.map((elem) => elem._id);
                finalQuery["eventrecord.control_point"] = { control_point: { $in: control_points } };
            });
        }
        
      // company_id: req.query.company_id ? req.query.company_id : null,
      if(query.company_id){
        await Family.find({ company: query.company_id }, { _id: 1 }, (err, families) => {
            let allFamilies = families.map((elem) => elem._id);
            finalQuery["packing.family"] = { "$in": allFamilies };
         });
      }

      // family_id: req.query.family_id ? req.query.family_id : null,
      if (query.family_id) finalQuery["packing.family"] = query.family_id;

      // serial: req.query.serial ? req.query.serial : null,
      if (query.serial) finalQuery["packing.serial"] = query.serial;
     
      // current_state: req.query.selectedStatus ? req.query.selectedStatus : null,
      if (query.current_state) finalQuery["currentstatehistory.type"] = query.current_state;

      // only_good_accuracy: req.query.onlyGoodAccuracy ? req.query.onlyGoodAccuracy : null
      if (query.only_good_accuracy == "true") finalQuery["devicedata.accuracy"] = { $lte: settings[0].accuracy_limit };
      
      console.log('\nfinalQuery');
      console.log(JSON.stringify(finalQuery));











    //   if (query.control_point_id !== null || query.control_point_type !== null) {
    //      event_record_conditions["type"] = "inbound";

    //      event_records = await event_record_service.find_by_control_point_and_date(
    //         event_record_conditions,
    //         query.current_state
    //      );
    //   } else {
    //      event_records = await device_data_service.find_by_date(event_record_conditions, query.current_state);
    //   }

    //   // console.log('results: ' + event_records.length);

    //   // console.log(event_records[0])

    //   if (query.company_id !== null || query.family_id != null || query.serial != null) {
    //      //let allFamilies = await Family.find({})

    //      if (query.control_point_id !== null || query.control_point_type !== null) {
    //         event_records = event_records.filter((er) => {
    //            // Se a família foi informada, então a empresa vinculada foi
    //            // selecionada automaticamente pelo front ...
    //            if (query.family_id != null) {
    //               if (query.family_id != null && query.serial != null) {
    //                  if (er.packing.family == query.family_id && er.packing.serial == query.serial) {
    //                     return true;
    //                  }
    //               } else if (query.family_id != null) {
    //                  if (er.packing.family == query.family_id) {
    //                     return true;
    //                  }
    //               } else {
    //                  if (er.packing.serial == query.serial) {
    //                     return true;
    //                  }
    //               }

    //               // Apenas a empresa vinculada foi selecionada
    //               // considere todas as famílias vinculadas a ela
    //            } else if (query.company_id !== null) {
    //               if (er.family.company == query.company_id) {
    //                  return true;
    //               }
    //            }
    //         });
    //      } else {
    //         event_records = event_records.filter((er) => {
    //            try {
    //               // Se a família foi informada, então a empresa vinculada foi
    //               // selecionada automaticamente pelo front ...
    //               if (query.family_id != null) {
    //                  if (query.family_id != null && query.serial != null) {
    //                     if (er.packing.family == query.family_id && er.packing.serial == query.serial) {
    //                        return true;
    //                     }
    //                  } else if (query.family_id != null) {
    //                     if (er.packing.family == query.family_id) {
    //                        return true;
    //                     }
    //                  } else {
    //                     if (er.packing.serial == query.serial) {
    //                        return true;
    //                     }
    //                  }

    //                  // Apenas a empresa vinculada foi selecionada
    //                  // considere todas as famílias vinculadas a ela
    //               } else if (query.company_id !== null) {
    //                  if (er.family.company == query.company_id) {
    //                     return true;
    //                  }
    //               }
    //            } catch (error) {
    //               // console.log(error)
    //               // console.log('error', er)
    //            }
    //         });
    //      }

         /*
            let allFamilies = await Family.find({})

            event_records = event_records.filter(er => {
                if (query.company_id !== null) {

                    let auxFamilies = allFamilies.filter(elem => elem.company == query.company_id)

                    if (auxFamilies.includes(er.packing.family)) {
                        if (query.family_id != null && query.serial != null) {
                            if (er.packing.family == query.family_id && er.packing.serial == query.serial) {
                                return true
                            }
                        } else if (query.family_id != null) {
                            if (er.packing.family == query.family_id) {
                                return true
                            }
                        } else {
                            if (er.packing.serial == query.serial) {
                                return true
                            }
                        }
                    }
                } else {
                    if (query.family_id != null && query.serial != null) {
                        if (er.packing.family == query.family_id && er.packing.serial == query.serial) {
                            return true
                        }
                    } else if (query.family_id != null) {
                        if (er.packing.family == query.family_id) {
                            return true
                        }
                    } else {
                        if (er.packing.serial == query.serial) {
                            return true
                        }
                    }
                }

                return false
            })
            */

         // event_records = event_records.filter(er => {
         //     if(query.company_id !== null){
         //         if (query.family_id != null && query.serial != null) {
         //             if (er.family.company == query.company_id && er.packing.family == query.family_id && er.packing.serial == query.serial) {
         //                 return true
         //             }
         //         } else if (query.family_id != null) {
         //             if (er.family.company == query.company_id && er.packing.family == query.family_id) {
         //                 return true
         //             }
         //         } else {
         //             if (er.family.company == query.company_id && er.packing.serial == query.serial) {
         //                 return true
         //             }
         //         }
         //     } else {
         //         if (query.family_id != null && query.serial != null) {
         //             if (er.packing.family == query.family_id && er.packing.serial == query.serial) {
         //                 return true
         //             }
         //         } else if (query.family_id != null) {
         //             if (er.packing.family == query.family_id) {
         //                 return true
         //             }
         //         } else {
         //             if (er.packing.serial == query.serial) {
         //                 return true
         //             }
         //         }
         //     }

         //     return false
         // })
    //   }

    //   return event_records;
   } catch (error) {
      throw new Error(error);
   }
};

const packingOnControlPoint = (packing, control_point) => {
   return packing.last_event_record && packing.last_event_record.type === "inbound"
      ? packing.last_event_record.control_point.toString() === control_point._id.toString()
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
