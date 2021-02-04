const debug = require("debug")("repository:reports");
const _ = require("lodash");
const moment = require("moment");
const { CurrentStateHistory } = require("../current_state_history/current_state_history.model");
const { Company } = require("../companies/companies.model");
const { ControlPoint } = require("../control_points/control_points.model");
const { EventRecord } = require("../event_record/event_record.model");
const { DeviceData } = require("../device_data/device_data.model");
const { Position } = require("../positions/positions.model");
const { Battery } = require("../batteries/batteries.model");
const { Family } = require("../families/families.model");
const { Packing } = require("../packings/packings.model");
const { GC16 } = require("../gc16/gc16.model");
const { Setting } = require("../settings/settings.model");
const owner_supplier_absent = require("./scripts/owner_supplier_absent");
const turf = require("@turf/turf");
const martinez = require("martinez-polygon-clipping");

exports.general_report = async () => {
   try {
      const aggregate = await Packing.aggregate([
         {
            $lookup: {
               from: "families",
               localField: "family",
               foreignField: "_id",
               as: "family_object",
            },
         },
         {
            $unwind: {
               path: "$family_object",
               preserveNullAndEmptyArrays: true,
            },
         },
         {
            $lookup: {
               from: "projects",
               localField: "project",
               foreignField: "_id",
               as: "project_object",
            },
         },
         {
            $unwind: {
               path: "$project_object",
               preserveNullAndEmptyArrays: true,
            },
         },
         {
            $group: {
               _id: "$family_object._id",
               company: {
                  $first: "$family_object.company",
               },
               project_name: {
                  $first: "$project_object.name",
               },
               packings_quantity: { $sum: 1 },
            },
         },
      ]);

      const data = await Promise.all(
         aggregate.map(async (aggr) => {
            let res = {};

            const family = await Family.findById(aggr._id, {
               control_points: 0,
               routes: 0,
               created_at: 0,
               update_at: 0,
               __v: 0,
            })
               .populate("company", "name")
               .populate("project");

            res = {
               family,
               packings_quantity: aggr.packings_quantity,
               project_name: aggr.project_name,
            };
            return res;
         })
      );

      return data;
   } catch (error) {
      throw new Error(error);
   }
};

exports.general_inventory_report = async () => {
   try {
      const families = await Family.find(
         {},
         { control_points: 0, routes: 0, created_at: 0, update_at: 0, __v: 0 }
      ).populate("company");
      const families_with_packings = await Promise.all(
         families.map(async (family) => {
            let family_obj = {};

            const _in_owner = await Packing.find(
               {
                  family: family._id,
                  absent: false,
                  active: true,
                  current_state: { $ne: "analise" },
               },
               {
                  weigth: 0,
                  width: 0,
                  heigth: 0,
                  length: 0,
                  capacity: 0,
                  temperature: 0,
                  active: 0,
                  absent: 0,
                  absent_time: 0,
                  cicle_start: 0,
                  last_cicle_duration: 0,
                  low_battery: 0,
                  permanence_time_exceeded: 0,
                  last_message_signal: 0,
                  current_state: 0,
                  _id: 0,
                  family: 0,
                  created_at: 0,
                  update_at: 0,
                  __v: 0,
                  last_device_data: 0,
                  last_current_state_history: 0,
                  last_device_data_battery: 0,
                  observations: 0,
                  project: 0,
                  type: 0,
                  offlineWhileAbsent: 0,
               }
            );

            const _in_clients = await Packing.find(
               { family: family._id, absent: true, active: true },
               {
                  weigth: 0,
                  width: 0,
                  heigth: 0,
                  length: 0,
                  capacity: 0,
                  temperature: 0,
                  active: 0,
                  absent: 0,
                  absent_time: 0,
                  cicle_start: 0,
                  last_cicle_duration: 0,
                  low_battery: 0,
                  permanence_time_exceeded: 0,
                  last_message_signal: 0,
                  current_state: 0,
                  _id: 0,
                  family: 0,
                  created_at: 0,
                  update_at: 0,
                  __v: 0,
                  last_device_data: 0,
                  last_current_state_history: 0,
                  last_device_data_battery: 0,
                  observations: 0,
                  project: 0,
                  type: 0,
                  offlineWhileAbsent: 0,
               }
            );

            const qtd_total = await Packing.find({ family: family._id, active: true }).count();

            const qtd_in_owner = await Packing.find({
               family: family._id,
               absent: false,
               active: true,
               current_state: { $ne: "analise" },
            }).count();

            let qtd_in_clients = await Packing.find({
               family: family._id,
               absent: true,
               active: true,
               current_state: { $in: ["local_correto"] },
            }).populate("last_event_record");

            let qtd_in_cp = await Packing.find(
               { family: family._id, active: true },
               {
                  weigth: 0,
                  width: 0,
                  heigth: 0,
                  length: 0,
                  capacity: 0,
                  temperature: 0,
                  active: 0,
                  absent: 0,
                  absent_time: 0,
                  cicle_start: 0,
                  last_cicle_duration: 0,
                  low_battery: 0,
                  permanence_time_exceeded: 0,
                  last_message_signal: 0,
                  current_state: 0,
                  _id: 0,
                  family: 0,
                  created_at: 0,
                  update_at: 0,
                  __v: 0,
                  last_device_data: 0,
                  last_current_state_history: 0,
                  last_device_data_battery: 0,
                  observations: 0,
                  project: 0,
                  type: 0,
                  offlineWhileAbsent: 0,
               }
            ).populate("last_event_record");

            const qtd_in_analysis = await Packing.find({
               family: family._id,
               current_state: "analise",
               active: true,
            }).count();

            const qtd_in_traveling = await Packing.find({
               family: family._id,
               active: true,
               absent: true,
               current_state: { $in: ["viagem_em_prazo"] },
            }).count();

            const qtd_in_traveling_late = await Packing.find({
               family: family._id,
               current_state: "viagem_atrasada",
               active: true,
            }).count();

            const qtd_in_traveling_missing = await Packing.find({
               family: family._id,
               current_state: "viagem_perdida",
               active: true,
            }).count();

            const qtd_in_correct_cp = await Packing.find({
               family: family._id,
               current_state: "local_correto",
               active: true,
            }).count();

            const qtd_in_incorrect_cp = await Packing.find({
               family: family._id,
               current_state: "local_incorreto",
               active: true,
            }).count();

            const qtd_with_permanence_time_exceeded = await Packing.find({
               family: family._id,
               permanence_time_exceeded: true,
               active: true,
            }).count();

            const qtd_no_signal = await Packing.find({
               family: family._id,
               current_state: "sem_sinal",
               active: true,
            }).count();

            const qtd_missing = await Packing.find({
               family: family._id,
               current_state: "perdida",
               active: true,
            }).count();

            const locations = await owner_general_inventory_report_detailed(family._id);

            qtd_in_clients = qtd_in_clients.filter(
               (packing) => packing.last_event_record && packing.last_event_record.type === "inbound"
            );

            qtd_in_cp = qtd_in_cp.filter(
               (packing) => packing.last_event_record && packing.last_event_record.type === "inbound"
            );

            family_obj.company = family.company ? family.company.name : "-";
            family_obj.family_id = family._id;
            family_obj.family_name = family.code;
            family_obj.qtd_total = qtd_total;
            family_obj.qtd_in_owner = qtd_in_owner;
            family_obj.qtd_in_clients = qtd_in_clients.length;
            family_obj.qtd_in_analysis = qtd_in_analysis;
            family_obj.qtd_in_cp = qtd_in_cp;
            family_obj.qtd_in_traveling = qtd_in_traveling + qtd_in_traveling_late + qtd_in_traveling_missing;
            family_obj.qtd_in_traveling_late = qtd_in_traveling_late;
            family_obj.qtd_in_traveling_missing = qtd_in_traveling_missing;
            family_obj.qtd_in_incorrect_cp = qtd_in_incorrect_cp;
            family_obj.qtd_with_permanence_time_exceeded = qtd_with_permanence_time_exceeded;
            family_obj.qtd_no_signal = qtd_no_signal;
            family_obj.qtd_missing = qtd_missing;
            family_obj.locations = Object.entries(_.countBy(locations, "control_point_name")).map(([key, value]) => ({
               cp: key,
               qtd: value,
            }));
            family_obj.locations.push({ cp: "", qtd: 0 });

            family_obj._in_owner = _in_owner;
            family_obj._in_clients = _in_clients;

            return family_obj;
         })
      );

      return families_with_packings;
   } catch (error) {
      console.log(error);
      throw new Error(error);
   }
};

const owner_general_inventory_report_detailed = async (family_id) => {
   const family = await Family.findById(family_id);
   const packings = await Packing.find({ family: family._id, absent: false, active: true }).populate(
      "last_event_record"
   );

   const data = await Promise.all(
      packings
         .filter((packing) => packing.last_event_record && packing.last_event_record.type === "inbound")
         .map(async (packing) => {
            let data_temp = {};

            const control_point = await ControlPoint.findById(packing.last_event_record.control_point);

            data_temp.packing = packing._id;
            data_temp.control_point_name = control_point ? control_point.name : "-";

            return data_temp;
         })
   );

   return data;
};

const general_inventory_report_detailed = async (family_id) => {
   const family = await Family.findById(family_id);
   const packings = await Packing.find({ family: family._id }).populate("last_event_record");
   const data = await Promise.all(
      packings
         .filter((packing) => packing.last_event_record && packing.last_event_record.type === "inbound")
         .map(async (packing) => {
            let data_temp = {};

            const control_point = await ControlPoint.findById(packing.last_event_record.control_point);

            data_temp.packing = packing._id;
            data_temp.control_point_name = control_point.name;

            return data_temp;
         })
   );

   return data;
};

exports.snapshot_report = async () => {
   try {
      //console.log('snapshot_report')
      const packings = await Packing.aggregate([
         {
            $lookup: {
               from: "families",
               localField: "family",
               foreignField: "_id",
               as: "family",
            },
         },
         {
            $unwind: {
               path: "$family",
               preserveNullAndEmptyArrays: true,
            },
         },
         {
            $lookup: {
               from: "positions",
               localField: "last_position",
               foreignField: "_id",
               as: "last_position",
            },
         },
         {
            $unwind: {
               path: "$last_position",
               preserveNullAndEmptyArrays: true,
            },
         },
         {
            $lookup: {
               from: "temperatures",
               localField: "last_temperature",
               foreignField: "_id",
               as: "last_temperature",
            },
         },
         {
            $unwind: {
               path: "$last_temperature",
               preserveNullAndEmptyArrays: true,
            },
         },
         {
            $lookup: {
               from: "batteries",
               localField: "last_battery",
               foreignField: "_id",
               as: "last_battery",
            },
         },
         {
            $unwind: {
               path: "$last_battery",
               preserveNullAndEmptyArrays: true,
            },
         },
         {
            $lookup: {
               from: "eventrecords",
               localField: "last_event_record",
               foreignField: "_id",
               as: "last_event_record",
            },
         },
         {
            $unwind: {
               path: "$last_event_record",
               preserveNullAndEmptyArrays: true,
            },
         },
         {
            $lookup: {
               from: "controlpoints",
               localField: "last_event_record.control_point",
               foreignField: "_id",
               as: "last_event_record.control_point",
            },
         },
         {
            $unwind: {
               path: "$last_event_record.control_point",
               preserveNullAndEmptyArrays: true,
            },
         },
         {
            $lookup: {
               from: "types",
               localField: "last_event_record.control_point.type",
               foreignField: "_id",
               as: "last_event_record.control_point.type",
            },
         },
         {
            $unwind: {
               path: "$last_event_record.control_point.type",
               preserveNullAndEmptyArrays: true,
            },
         },
         {
            $project: {
               _id: 1,
               serial: 1,
               "tag.code": 1,
               current_state: 1,
               cicle_start: 1,
               cicle_end: 1,
               last_cicle_duration: 1,
               "family.code": 1,
               last_position: 1,
               last_temperature: 1,
               last_battery: 1,
               last_event_record: 1,
               absent: 1,
               absent_time: 1,
            },
         },
      ]);

      const settings = await Setting.find({});

      const data = await Promise.all(
         packings.map(async (packing) => {
            let obj = {};
            const battery_level = packing.last_battery ? packing.last_battery.battery : null;
            const lastAccurateMessage = packing.last_position;

            obj.id = packing._id;
            obj.message_date = packing.last_position
               ? `${moment(packing.last_position.date).locale("pt-br").format("L")} ${moment(packing.last_position.date)
                    .locale("pt-br")
                    .format("LTS")}`
               : "-";
            obj.family = packing.family ? packing.family.code : "-";
            obj.serial = packing.serial;
            obj.tag = packing.tag.code;
            obj.current_state = packing.current_state;
            obj.collect_date = `${moment().locale("pt-br").format("L")} ${moment().locale("pt-br").format("LT")}`;
            obj.accuracy = packing.last_position ? packing.last_position.accuracy : "-";
            obj.lat_lng_device = await getLatLngOfPacking(packing);
            obj.cicle_start = packing.cicle_start ? packing.cicle_start : "-";
            obj.cicle_end = packing.cicle_end ? packing.cicle_end : "-";
            obj.last_cicle_duration = packing.last_cicle_duration ? packing.last_cicle_duration : "-";

            obj.lat_lng_cp = "-";
            obj.cp_type = "-";
            obj.cp_name = "-";
            obj.geo = "-";
            obj.area = "-";
            obj.permanence_time = "-";

            if (packing.last_event_record) {
               if (packing.last_event_record.type) {
                  if (packing.last_event_record.type == "inbound") {
                     obj.lat_lng_cp = await getLatLngOfControlPoint(packing);

                     let tempActualControlPoint = await getActualControlPoint(packing);

                     obj.cp_type = tempActualControlPoint.type.name;
                     obj.cp_name = tempActualControlPoint.name;
                     obj.geo = tempActualControlPoint.geofence.type;

                     obj.area = await getAreaControlPoint(packing);

                     if (["analise", "perdida", "sem_sinal"].includes(packing.current_state)) {
                        obj.permanence_time = "-";
                     } else {
                        obj.permanence_time = getDiffDateTodayInHours(packing.last_event_record.created_at);
                     }
                  }
               }
            }

            obj.signal =
               packing.current_state === "sem_sinal"
                  ? "FALSE"
                  : packing.current_state === "desabilitada_sem_sinal"
                  ? "FALSE"
                  : packing.current_state === "perdida"
                  ? "FALSE"
                  : "TRUE";
            obj.battery = battery_level ? battery_level : "-";
            obj.battery_alert = battery_level
               ? battery_level > settings[0].battery_level_limit
                  ? "FALSE"
                  : "TRUE"
               : "FALSE";

            obj.temperature = packing.last_temperature ? packing.last_temperature.value : "-";

            obj.travel_time = "-";
            if (packing.last_event_record) {
               if (packing.last_event_record.type) {
                  if (packing.last_event_record.type === "outbound") {
                     obj.travel_time = getDiffDateTodayInHours(packing.last_event_record.created_at);
                  }
               }
            }

            //--------------------------------------------------
            //Begin: Calculate no signal while absent, if absent
            obj.absent_time = "-";
            if (packing.absent == true) {
               let noSignalTimeSinceAbsent = 0;
               noSignalTimeSinceAbsent = calculateAbsentIntervalsOfflineTime(packing);

               let absentTimeUntilNow = 0;
               absentTimeUntilNow = await getDiffDateTodayInHours(packing.absent_time);

               // console.log(`getDiffDateTodayInHours: ${await getDiffDateTodayInHours(packing.absent_time)}, tag: ${packing.tag.code}`)
               // console.log(`noSignalTimeSinceAbsent: ${noSignalTimeSinceAbsent}, tag: ${packing.tag.code} `)

               if (noSignalTimeSinceAbsent > 0.0) {
                  //if some trouble occurred and the noSignalTimeSinceAbsent > absentTimeUntilNow, consider absentTimeUntilNow = 0
                  if (noSignalTimeSinceAbsent > absentTimeUntilNow) {
                     noSignalTimeSinceAbsent = 0;
                     absentTimeUntilNow = 0;
                  }

                  obj.absent_time =
                     packing.absent && packing.absent_time !== null
                        ? absentTimeUntilNow - noSignalTimeSinceAbsent
                        : "-";
               } else {
                  obj.absent_time =
                     packing.absent && packing.absent_time !== null
                        ? await getDiffDateTodayInHours(packing.absent_time)
                        : "-";
               }
            }
            //End: Calculate no signal while absent, if absent

            return obj;
         })
      );

      return data;
   } catch (error) {
      throw new Error(error);
   }
};

exports.snapshot_recovery_report = async (snapshot_date) => {
   // console.log('snapshot_recovery_report')

   try {
      /**
       * 1. Recuperar lista de packings. Para cada um:
       * 2. Recuperar próximo devicedata a partir da data especificada.
       * 3. calcular intersecção
       * 4. Montar objeto do snapshot
       */

      const packings = await Packing.find({}).populate("family", "code");
      const controlPoints = await ControlPoint.find({}).populate("type");
      const settings = await Setting.find({});

      // 1. Recuperar lista de packings. Para cada um:
      const data = await Promise.all(
         packings.map(async (packing) => {
            // 2. Recuperar próximo position a partir da data especificada.
            const position = await Position.findOne({
               device_id: packing.tag.code,
               date: { $lte: new Date(snapshot_date) },
            });

            const battery = await Battery.findOne({
               battery: { $ne: null },
               tag: packing.tag.code,
               date: { $lte: new Date(snapshot_date) },
            });

            let obj = {
               id: "",
               message_date: "",
               family: "",
               serial: "",
               tag: "",
               collect_date: "",
               accuracy: "",
               lat_lng_device: "",
               lat_lng_cp: "",
               cp_type: "",
               cp_name: "",
               geo: "",
               area: "",
               battery: "",
               battery_alert: "",
            };

            obj.id = packing._id;
            obj.family = packing.family ? packing.family.code : "-";
            obj.serial = packing.serial;
            obj.tag = packing.tag.code;

            obj.collect_date = `${moment(snapshot_date).locale("pt-br").format("L")} ${moment(snapshot_date)
               .locale("pt-br")
               .format("LT")}`;

            obj.cicle_start = packing.cicle_start ? packing.cicle_start : "-";
            obj.cicle_end = packing.cicle_end ? packing.cicle_end : "-";
            obj.last_cicle_duration = packing.last_cicle_duration ? packing.last_cicle_duration : "-";

            if (position !== null) {
               packing.last_position = position;

               // 3. calcular intersecção
               const current_control_point = await findControlPointIntersection(packing, controlPoints, settings);

               // console.log('current_control_point')
               // console.log(current_control_point)

               //obj.message_date = position.message_date
               obj.message_date = position
                  ? `${moment(position.message_date).locale("pt-br").format("L")} ${moment(position.message_date)
                       .locale("pt-br")
                       .format("LTS")}`
                  : "-";
               obj.accuracy = position.accuracy;
               obj.lat_lng_device = await getLatLngOfPacking(packing);

               if (battery !== null) {
                  obj.battery = battery.battery;
                  obj.battery_alert = battery.battery < settings[0].battery_level_limit ? "TRUE" : "FALSE";
               }

               if (current_control_point) {
                  obj.cp_type = current_control_point.type.name;
                  obj.cp_name = current_control_point.name;
                  obj.geo = current_control_point.geofence.type;

                  //lat_lng_cp
                  if (current_control_point.geofence.type == "c") {
                     obj.lat_lng_cp = `${current_control_point.geofence.coordinates[0].lat} ${current_control_point.geofence.coordinates[0].lng}`;
                  } else {
                     let lat = current_control_point.geofence.coordinates.map((p) => p.lat);
                     let lng = current_control_point.geofence.coordinates.map((p) => p.lng);
                     obj.lat_lng_cp = `${(Math.min.apply(null, lat) + Math.max.apply(null, lat)) / 2} ${
                        (Math.min.apply(null, lng) + Math.max.apply(null, lng)) / 2
                     }`;
                  }

                  //area
                  if (current_control_point.geofence.type == "c") {
                     obj.area = `{(${current_control_point.geofence.coordinates[0].lat} ${current_control_point.geofence.coordinates[0].lng}), ${current_control_point.geofence.radius}}`;
                  } else {
                     let result = "[";
                     current_control_point.geofence.coordinates.map((p, i, arr) => {
                        if (arr.length - 1 == i) result += `(${p.lat} ${p.lng})`;
                        else result += `(${p.lat} ${p.lng}), `;
                     });
                     result += "]";

                     obj.area = result;
                  }
               }
            }
            return obj;
         })
      );

      // console.log('....................')
      // console.log(new Date())
      return data;
   } catch (error) {
      throw new Error(error);
   }
};

/**
 * This method calculates the amount of time the package has been 'sem_sinal', 'perdida' ou 'ausente' since missing.
 * @param {*} packing The package to be analyzed
 */
const calculateAbsentIntervalsOfflineTime = (packing) => {
   let acum = 0;

   if (packing.offlineWhileAbsent) {
      packing.offlineWhileAbsent.map((elem) => {
         if (elem.start !== null) {
            let result = calculateRangeTime(elem.start, elem.end == null ? 0 : elem.end);
            acum += result;
         }
      });
   }

   return acum;
};

const calculateAbsentWithoutLostTime = async (statuses) => {
   //console.log('calculateAbsentWithoutLostTime')
   if (statuses.length == 0) {
      return 0;
   } else {
      let pivot = 0;
      let lostSignal = false;
      let lostSignalFrom = null;
      let lostSignalTo = null;
      let totalTime = 0.0;

      //console.log('1')
      while (pivot < statuses.length) {
         //console.log('2')
         if (lostSignal) {
            //console.log('3')
            if (statuses[pivot].type == "sinal") {
               //console.log('4')
               lostSignal = false;
               lostSignalTo = statuses[pivot].created_at;

               totalTime += calculateRangeTime(lostSignalFrom, lostSignalTo);
               //console.log('totalTime: ' + totalTime)
               lostSignalFrom = 0;
               lostSignalTo = 0;
            }
         } else {
            //console.log('5')
            //if((statuses[pivot] == 'sem_sinal') || (statuses[pivot] == 'perdida')){
            if (statuses[pivot].type == "sem_sinal") {
               //console.log('6')
               lostSignal = true;
               lostSignalFrom = statuses[pivot].created_at;
            }
         }
         pivot++;
      }

      // console.log('>>')
      // console.log(totalTime)

      return totalTime;
   }
};

const calculateRangeTime = (dateFrom, dateTo) => {
   // console.log('dateFrom: ' + dateFrom)
   // console.log('dateTo: ' + dateTo)

   //has begin and end
   if (dateFrom !== 0 && dateTo !== 0) {
      const today = moment();
      dateTo = moment(dateTo);
      let duration = moment.duration(dateTo.diff(dateFrom));
      return duration.asHours();
   }

   //has not begin, but has end
   if (dateFrom == 0 && dateTo !== 0) {
      return 0;
   }

   //has begin, but no end
   if (dateFrom !== 0 && dateTo == 0) {
      return getDiffDateTodayInHours(dateFrom);
   }

   //nas not begin neither end
   if (dateFrom == 0 && dateTo == 0) {
      return 0;
   }
};

exports.absent_report = async (query = { family: null, serial: null, absent_time_in_hours: null }) => {
   try {
      let packings = [];
      let current_family = query.family ? await Family.findOne({ _id: query.family }) : null;

      switch (true) {
         case query.family != null && query.serial != null:
            packings = await Packing.find(
               {
                  absent: true,
                  active: true,
                  family: current_family._id,
                  serial: query.serial,
               },
               { serial: 1, absent_time: 1, current_state: 1, "tag.code": 1 }
            )
               .populate("family", "code")
               .populate("last_battery")
               .populate("last_event_record");
            break;
         case query.family != null:
            packings = await Packing.find(
               { absent: true, active: true, family: current_family._id },
               { serial: 1, absent_time: 1, current_state: 1, "tag.code": 1 }
            )
               .populate("family", "code")
               .populate("last_battery")
               .populate("last_event_record");
            break;
         case query.serial != null:
            packings = await Packing.find(
               { absent: true, active: true, serial: query.serial },
               { serial: 1, absent_time: 1, current_state: 1, "tag.code": 1 }
            )
               .populate("family", "code")
               .populate("last_battery")
               .populate("last_event_record");
            break;
         default:
            packings = await Packing.find(
               { absent: true, active: true },
               { serial: 1, absent_time: 1, current_state: 1, "tag.code": 1 }
            )
               .populate("family", "code")
               .populate("last_battery")
               .populate("last_event_record");
            break;
      }

      const data = await Promise.all(
         packings.map(async (packing) => {
            let object_temp = {};

            object_temp._id = packing._id;
            object_temp.tag = packing.tag.code;
            object_temp.current_state = packing.current_state;
            object_temp.family = packing.family;
            object_temp.serial = packing.serial;

            if (packing.last_event_record) {
               let aux_last_event_record = await EventRecord.findById(packing.last_event_record).populate(
                  "control_point"
               );
               object_temp.control_point_name =
                  aux_last_event_record.control_point !== null
                     ? aux_last_event_record.control_point.name
                     : "Não encontrado";
            } else {
               object_temp.control_point_name = "Sem registro";
            }

            object_temp.absent_time_in_hours = packing.absent_time
               ? await getDiffDateTodayInHours(packing.absent_time)
               : "0";

            return object_temp;
         })
      );

      if (query.absent_time_in_hours != null) {
         const packings_filtered = data.filter((packing) => packing.absent_time_in_hours < query.absent_time_in_hours);
         return packings_filtered;
      }

      return data;
   } catch (error) {
      throw new Error(error);
   }
};

exports.permanence_time_report = async (query = { paramFamily: null, paramSerial: null }) => {
   try {
      let packings = [];
      //let current_family = query.paramFamily ? await Family.findOne({ _id: query.paramFamily }) : null

      switch (true) {
         case query.paramFamily != null && query.paramSerial != null:
            packings = await Packing.find({
               permanence_time_exceeded: true,
               active: true,
               family: query.paramFamily,
               serial: query.paramSerial,
            })
               .populate("family", "_id code company")
               .populate("last_postition")
               .populate("last_battery")
               .populate("last_event_record");
            break;

         case query.paramFamily != null:
            packings = await Packing.find({ permanence_time_exceeded: true, active: true, family: query.paramFamily })
               .populate("family", "_id code company")
               .populate("last_postition")
               .populate("last_battery")
               .populate("last_event_record");
            break;

         case query.paramSerial != null:
            packings = await Packing.find({ permanence_time_exceeded: true, active: true, serial: query.paramSerial })
               .populate("family", "_id code company")
               .populate("last_postition")
               .populate("last_battery")
               .populate("last_event_record");
            break;

         default:
            packings = await Packing.find({ permanence_time_exceeded: true, active: true })
               .populate("family", "_id code company")
               .populate("last_postition")
               .populate("last_battery")
               .populate("last_event_record");
            break;
      }

      let data = [];
      if (query.paramSerial != null) {
         data = await Promise.all(
            packings
               .filter((packing) => packing.last_event_record && packing.last_event_record.type === "inbound")
               .map(async (packing) => {
                  let object_temp = {};
                  let stock_in_days = null;

                  const current_control_point = await ControlPoint.findById(
                     packing.last_event_record.control_point
                  ).populate("type");
                  const current_company = await Company.findById(packing.family.company);
                  const gc16 = packing.family.gc16 ? await GC16.findById(packing.family.gc16) : null;
                  if (gc16) stock_in_days = current_company.type === "owner" ? gc16.owner_stock : gc16.client_stock;

                  object_temp._id = packing._id;
                  object_temp.tag = packing.tag.code;
                  object_temp.family_id = packing.family._id;
                  object_temp.family_code = packing.family ? packing.family.code : "-";
                  object_temp.serial = packing.serial;
                  object_temp.current_control_point_name =
                     current_control_point !== null ? current_control_point.name : "-";
                  object_temp.current_control_point_type =
                     current_control_point !== null ? current_control_point.type.name : "-";
                  object_temp.date = packing.last_event_record.created_at;
                  object_temp.permanence_time_exceeded = getDiffDateTodayInHours(packing.last_event_record.created_at);
                  if (gc16) object_temp.stock_in_days = stock_in_days.days;

                  return object_temp;
               })
         );
      } else {
         data = await Promise.all(
            packings
               .filter((packing) => packing.last_event_record && packing.last_event_record.type === "inbound")
               .map(async (packing) => {
                  let object_temp = {};

                  const current_control_point = await ControlPoint.findById(
                     packing.last_event_record.control_point
                  ).populate("type");
                  const current_company = await Company.findById(packing.family.company);

                  object_temp._id = packing._id;
                  object_temp.tag = packing.tag.code;
                  object_temp.family_id = packing.family._id;
                  object_temp.family_code = packing.family ? packing.family.code : "-";
                  object_temp.serial = packing.serial;
                  object_temp.current_control_point_name =
                     current_control_point !== null ? current_control_point.name : "-";
                  object_temp.current_control_point_type =
                     current_control_point !== null ? current_control_point.type.name : "-";
                  object_temp.permanence_time_exceeded = getDiffDateTodayInHours(packing.last_event_record.created_at);
                  object_temp.company = current_company !== null ? current_company.name : "-";

                  return object_temp;
               })
         );
      }

      if (query.absent_time_in_hours != null) {
         const packings_filtered = data.filter((packing) => packing.absent_time_in_hours < query.absent_time_in_hours);
         return packings_filtered;
      }

      return data;
   } catch (error) {
      throw new Error(error);
   }
};

exports.battery_report = async (family_id = null) => {
   try {
      let packings = [];

      switch (true) {
         case family_id != null:
            packings = await Packing.find({ active: true, family: family_id })
               .populate("family", "_id code")
               .populate("last_battery")
               .populate("last_event_record");
            break;
         default:
            packings = await Packing.find({ active: true })
               .populate("family", "_id code")
               .populate("last_battery")
               .populate("last_event_record");
            break;
      }

      const data = await Promise.all(
         packings.map(async (packing) => {
            let object_temp = {};

            const current_control_point = packing.last_event_record
               ? await ControlPoint.findById(packing.last_event_record.control_point).populate("type")
               : null;

            object_temp._id = packing._id;
            object_temp.tag = packing.tag.code;
            object_temp.family_id = packing.family._id;
            object_temp.family_code = packing.family ? packing.family.code : "-";
            object_temp.serial = packing.serial;
            object_temp.current_control_point_name = current_control_point
               ? current_control_point.name
               : "Fora de um ponto de controle";

            object_temp.current_control_point_type = current_control_point
               ? current_control_point.type.name
               : "Fora de um ponto de controle";

            object_temp.battery_percentage = packing.last_battery ? packing.last_battery.battery : "-";

            object_temp.battery_date = packing.last_battery ? packing.last_battery.date : "-";

            return object_temp;
         })
      );

      return data;
   } catch (error) {
      throw new Error(error);
   }
};

exports.quantity_report = async (family_id = null) => {
   try {
      let data = [];
      const families = family_id
         ? await Family.find({ _id: family_id }, { controlPoints: 0 })
              .populate("company")
              .populate("gc16")
              .populate("routes")
              .populate("control_points")
         : await Family.find({}).populate("company").populate("gc16").populate("routes").populate("control_points");

      for (let family of families) {
         let stock = null;

         if (family.gc16) stock = family.company.type === "owner" ? family.gc16.owner_stock : family.gc16.client_stock;
         const packings = await Packing.find({ family: family._id, active: true }).populate("last_event_record");
         const qtd_total = await Packing.find({ family: family._id, active: true }).count();
         // const qtd_analysis = await Packing.find({ family: family._id, current_state: 'analise' }).count()
         const packings_outbound = packings.filter(
            (packing) => packing.last_event_record && packing.last_event_record.type === "outbound"
         );
         const packings_inbound = await Promise.all(
            packings
               .filter((packing) => packing.last_event_record && packing.last_event_record.type === "inbound")
               .map(async (packing) => {
                  let obj_temp = {};
                  const cp = await ControlPoint.findById(packing.last_event_record.control_point).populate("type");

                  obj_temp.control_point_name = cp !== null ? cp.name : "-";
                  obj_temp.control_point_type = cp !== null ? cp.type.name : "-";

                  return obj_temp;
               })
         );

         const output = Object.entries(_.countBy(packings_inbound, "control_point_name")).map(([key, value]) => {
            const packing_temp = packings_inbound.filter((p) => p.control_point_name === key);
            return {
               family_code: family.code,
               company: family.company ? family.company.name : "-",
               stock_min: stock ? stock.qty_container : "-",
               stock_max: stock ? stock.qty_container_max : "-",
               packings_traveling: packings_outbound.length,
               total: value,
               control_point_name: key,
               control_point_type: packing_temp[0].control_point_type,
               qtd_total: qtd_total,
            };
         });

         data.push(output);
      }

      return _.flatMap(data);
   } catch (error) {
      throw new Error(error);
   }
};

exports.general_info_report = async (family_id = null) => {
   try {
      let current_family = family_id ? await Family.findOne({ _id: family_id }) : null;
      let packings =
         family_id != null
            ? await Packing.find({ active: true, family: current_family._id })
                 .populate("family", { routes: 0, control_points: 0 })
                 .populate("last_position")
                 .populate("last_battery")
                 .populate("last_event_record")
            : await Packing.find({ active: true })
                 .populate("family", { routes: 0, control_points: 0 })
                 .populate("last_position")
                 .populate("last_battery")
                 .populate("last_event_record")
                 .populate("last_current_state_history");

      const data = await Promise.all(
         packings.map(async (packing) => {
            let object_temp = {};
            let current_control_point = null;

            object_temp.current_control_point_name = "-";
            object_temp.current_control_point_type = "-";

            if (packing.last_event_record) {
               if (packing.last_event_record.type == "inbound") {
                  current_control_point = await ControlPoint.findById(packing.last_event_record.control_point).populate(
                     "type"
                  );

                  //console.log(current_control_point)

                  if (current_control_point) {
                     object_temp.current_control_point_name = current_control_point.name;
                     object_temp.current_control_point_type = current_control_point.type
                        ? current_control_point.type.name
                        : "-";
                  }
               } else {
                  object_temp.current_control_point_name = current_control_point
                     ? current_control_point.name
                     : "Fora de um ponto de controle";
                  object_temp.current_control_point_type = current_control_point
                     ? current_control_point.type.name
                     : "Fora de um ponto de controle";
               }
            }

            //const current_control_point = packing.last_event_record ? await ControlPoint.findById(packing.last_event_record.control_point).populate('type') : null
            const company = await Company.findById(packing.family.company);

            object_temp._id = packing._id;
            object_temp.tag = packing.tag.code;
            object_temp.family_code = packing.family ? packing.family.code : "-";
            object_temp.serial = packing.serial;
            object_temp.company = company ? company.name : "-";
            object_temp.current_state = packing.current_state;

            //dados do último inbound/outbound
            object_temp.in_out_accuracy = packing.last_event_record ? packing.last_event_record.accuracy : "-";
            object_temp.in_out_date = packing.last_event_record ? packing.last_event_record.created_at : "-";
            // object_temp.in_out_accuracy = packing.last_current_state_history ? packing.last_current_state_history.accuracy : '-'
            // object_temp.in_out_date = packing.last_current_state_history ? packing.last_current_state_history.created_at : '-'

            //dados atuais
            object_temp.accuracy = packing.last_position ? packing.last_position.accuracy : "Sem registro";
            object_temp.date = packing.last_position ? packing.last_position.date : "Sem registro";

            object_temp.battery_percentage = packing.last_battery ? packing.last_battery.battery : "Sem registro";
            object_temp.battery_date = packing.last_battery ? packing.last_battery.date : "-";

            return object_temp;
         })
      );

      return data;
   } catch (error) {
      throw new Error(error);
   }
};

exports.clients_report = async (company_id = null) => {
   try {
      let data = [];
      //Busca todas as familias vinculadas a esta empresa
      const families = company_id
         ? await Family.find({ company: company_id }).populate("company").populate("gc16")
         : await Family.find({}).populate("company").populate("gc16");

      //Para cada família, faça:
      for (let family of families) {
         try {
            //Busca todas as embalagens que pertencem à família atual do loop
            const packings = await Packing.find({ family: family._id, active: true }).populate("last_event_record");

            //Da lista packings, filtra as que fizeram outbound
            const packings_outbound = packings.filter(
               (packing) => packing.last_event_record && packing.last_event_record.type === "outbound"
            );

            const packings_inbound = await Promise.all(
               //Da lista packings, filtra as que fizeram inbound
               packings
                  .filter((packing) => packing.last_event_record && packing.last_event_record.type === "inbound")
                  .map(async (packing) => {
                     let obj_temp = {};
                     //Preenche as informações do ponto de controle a qual fez inbound
                     const cp = await ControlPoint.findById(packing.last_event_record.control_point)
                        .populate("type")
                        .populate("company");

                     if (cp == null) {
                        obj_temp.control_point_id = "-";
                        obj_temp.control_point_name = "-";
                        obj_temp.control_point_type = "-";
                        obj_temp.company_control_point_name = "-";
                     } else {
                        obj_temp.control_point_id = cp._id;
                        obj_temp.control_point_name = cp.name;
                        obj_temp.control_point_type = cp.type.name;
                        obj_temp.company_control_point_name = cp.company ? cp.company.name : "-";
                     }

                     return obj_temp;
                  })
            );

            // console.log(packings_inbound);

            const output = Object.entries(_.countBy(packings_inbound, "control_point_name")).map(([key, value]) => {
               const packing_temp = packings_inbound.filter((p) => p.control_point_name === key);
               return {
                  family_code: family.code,
                  company_id: family.company._id,
                  company: family.company ? family.company.name : "-",
                  packings_traveling: packings_outbound.length,
                  control_point_name: key,
                  control_point_type: packing_temp[0].control_point_type,
                  qtd: value,
               };
            });
            data.push(output);
         } catch (error) {
            console.log(error);
         }
      }

      return _.flatMap(data);
   } catch (error) {
      throw new Error(error);
   }
};

exports.owner_supplier_absent = async () => { 
   return owner_supplier_absent();
};

const getLatLngOfPacking = async (packing) => {
   if (!packing.last_position) return "-";
   return `${packing.last_position.latitude} ${packing.last_position.longitude}`;
};

const getActualControlPoint = async (packing) => {
   // const current_control_point = await ControlPoint.findById(packing.last_event_record.control_point).populate("type");
   const current_control_point = packing.last_event_record.control_point;

   if (current_control_point == null || current_control_point == undefined) {
      let result = {
         name: "-",
         full_address: "-",
         type: {
            name: "-",
         },
         company: "-",
         geofence: {
            coordinates: [],
            type: "-",
         },
         duns: "",
      };
      return result;
   } else {
      return current_control_point;
   }
};

const getLatLngOfControlPoint = async (packing) => {
   //console.log('getLatLngOfControlPoint ', packing.tag.code)
   const current_control_point = await ControlPoint.findById(packing.last_event_record.control_point);

   if (current_control_point !== null && current_control_point !== undefined) {
      if (current_control_point.geofence.type == "c") {
         return `${current_control_point.geofence.coordinates[0].lat} ${current_control_point.geofence.coordinates[0].lng}`;
      } else {
         let lat = current_control_point.geofence.coordinates.map((p) => p.lat);
         let lng = current_control_point.geofence.coordinates.map((p) => p.lng);
         return `${(Math.min.apply(null, lat) + Math.max.apply(null, lat)) / 2} ${
            (Math.min.apply(null, lng) + Math.max.apply(null, lng)) / 2
         }`;
      }
   } else {
      return "-";
   }
};

const getAreaControlPoint = async (packing) => {
   //console.log('getAreaControlPoint ', packing.tag.code)
   const current_control_point = await ControlPoint.findById(packing.last_event_record.control_point);

   if (current_control_point !== null && current_control_point !== undefined) {
      if (current_control_point.geofence.type == "c") {
         return `{(${current_control_point.geofence.coordinates[0].lat} ${current_control_point.geofence.coordinates[0].lng}), ${current_control_point.geofence.radius}}`;
      } else {
         let result = "[";
         current_control_point.geofence.coordinates.map((p, i, arr) => {
            if (arr.length - 1 == i) result += `(${p.lat} ${p.lng})`;
            else result += `(${p.lat} ${p.lng}), `;
         });
         result += "]";

         return result;
      }
   } else {
      return "-";
   }
};

const getTypeOfControlPoint = async (packing) => {
   const current_control_point = await ControlPoint.findById(packing.last_event_record.control_point).populate("type");
   return current_control_point.type.name;
};

const getNameOfControlPoint = async (packing) => {
   const current_control_point = await ControlPoint.findById(packing.last_event_record.control_point).populate("type");
   return current_control_point.name;
};

const getAbsentTimeCountDown = async (packing) => {
   let diff_date_array = [];

   if (packing.last_event_record) {
      const event_records = await EventRecord.find({ packing: packing._id, type: "outbound" }).sort({ created_at: -1 });
      if (!event_records.length > 0) return "-";

      diff_date_array = await Promise.all(
         event_records.map(async (event_record) => {
            let created_at = {};

            const current_control_point = await ControlPoint.findOne({ _id: event_record.control_point }).populate(
               "company"
            );
            created_at = current_control_point.company.type === "owner" ? event_record.created_at : null;

            return getDiffDateTodayInHours(created_at);
         })
      );

      const data = diff_date_array.reduce((count, element) => (element > count ? (count = element) : count));

      return data;
   }
   return "-";
};

const getDiffDateTodayInHours = (date) => {
   const today = moment();
   date = moment(date);

   const duration = moment.duration(today.diff(date));
   return duration.asHours();
};

const findControlPointIntersection = async (packing, controlPoints, setting) => {
   let distance = Infinity;
   let currentControlPoint = null;
   let range_radius = 0;
   let isInsidePolygon = false;

   //Deve ser otimizado para sair do loop quando for encontrado dentro de um polígono
   controlPoints.forEach(async (controlPoint) => {
      //isInsidePolygon = false
      //mLog('controlPoints')

      if (controlPoint.geofence.type === "p") {
         if (!isInsidePolygon) {
            //if (pnpoly(packing, controlPoint)) {
            if (intersectionpoly(packing, controlPoint)) {
               //mLog(`>> POLIGONO: DENTRO DO PONTO DE CONTROLE p: ${packing._id} e cp: ${controlPoint._id}` )
               distance = 0;
               currentControlPoint = controlPoint;
               isInsidePolygon = true;
            }
         }
      } else {
         if (!isInsidePolygon) {
            //mLog(`== CIRCULO: DENTRO DO PONTO DE CONTROLE p: ${packing._id} e cp: ${controlPoint._id}`)

            const calculate = getDistanceFromLatLonInKm(
               packing.last_position.latitude,
               packing.last_position.longitude,
               controlPoint.geofence.coordinates[0].lat,
               controlPoint.geofence.coordinates[0].lng
            );

            if (calculate < distance) {
               distance = calculate;
               currentControlPoint = controlPoint;
               range_radius = controlPoint.geofence.radius;
            }
         }
      }
   });

   return currentControlPoint;
};

const intersectionpoly = (packing, controlPoint) => {
   try {
      //mLog('intersectionpoly?')

      //criar polígono da planta
      let coordinates = controlPoint.geofence.coordinates;

      let path = [];
      let templateTurfPolygon = [];

      coordinates.forEach((elem) => {
         path.push([elem.lng, elem.lat]);
      });
      path.push(path[0]);
      //mLog('> ', path)

      //linha do polígono
      let controlPointLine = turf.lineString(path);
      // mLog('lineString')
      // mLog(JSON.stringify(controlPointLine))

      //limpando a linha do polígono
      //controlPointLine.geometry.type = "Polygon"
      //mLog(controlPointLine)
      controlPointLine = turf.cleanCoords(controlPointLine).geometry.coordinates;
      // mLog('cleanCoords')
      // mLog(controlPointLine)

      let newControlPointLine = turf.lineString(controlPointLine);

      //reconverte para o LineString limpo para polígno
      controlPointPolygon = turf.lineToPolygon(newControlPointLine);

      // mLog('antes:')
      // mLog(JSON.stringify(controlPointPolygon))

      //se o polígono tem autointersecção, então quebra em 2 ou mais features
      //se o polígono não tem auto intersecção, então o mantém
      let unkinkControlPointPolygon = turf.unkinkPolygon(controlPointPolygon);

      if (unkinkControlPointPolygon.features.length > 1) {
         //Caso o polígono tenha auto intersecção
         // mLog('p com auto intersecção')
         // mLog('.depois:')
         // mLog(JSON.stringify(unkinkControlPointPolygon))

         let controlPointPolygonArray = [];

         unkinkControlPointPolygon.features.forEach((feature) => {
            let auxPolygon = turf.polygon(feature.geometry.coordinates);
            controlPointPolygonArray.push(auxPolygon);
         });

         let result = false;

         controlPointPolygonArray.forEach((mPolygon) => {
            //criar polígono da embalagem
            let center = [packing.last_position.longitude, packing.last_position.latitude];
            let radius = packing.last_position.accuracy;
            let options = { steps: 64, units: "meters" };

            //mLog(center, radius)
            let packingPolygon = turf.circle(center, radius, options);
            //mLog('c: ')
            //mLog(JSON.stringify(packingPolygon))

            //checar intersecção
            let intersection = turf.intersect(mPolygon, packingPolygon);
            let intersectionMartinez = martinez.intersection(
               controlPointPolygon.geometry.coordinates,
               packingPolygon.geometry.coordinates
            );

            //checar inclusão total
            let contained = turf.booleanContains(mPolygon, packingPolygon);

            // mLog(' ')
            // mLog('i: ', packing.tag.code)
            // mLog(intersection)

            if (result == false)
               result = intersection !== null || intersectionMartinez !== null || contained !== false ? true : false;
         });

         //mLog(result)

         return result;
      } else {
         //Caso o polígono não tenha autointersecção
         // mLog('p sem auto intersecção')
         // mLog('..depois:')
         // mLog(JSON.stringify(unkinkControlPointPolygon))

         //criar polígono da embalagem
         let center = [packing.last_position.longitude, packing.last_position.latitude];
         let radius = packing.last_position.accuracy;
         let options = { steps: 64, units: "meters" };

         //mLog(center, radius)
         let packingPolygon = turf.circle(center, radius, options);
         //mLog('c: ')
         //mLog(JSON.stringify(packingPolygon))

         //checar intersecção
         let intersection = turf.intersect(controlPointPolygon, packingPolygon);
         let intersectionMartinez = martinez.intersection(
            controlPointPolygon.geometry.coordinates,
            packingPolygon.geometry.coordinates
         );

         //checar inclusão total
         let contained = turf.booleanContains(controlPointPolygon, packingPolygon);

         // mLog(' ')
         // mLog('i: ', packing.tag.code)
         // mLog(intersection)

         let result = intersection !== null || intersectionMartinez !== null || contained !== false ? true : false;

         return result;
      }
   } catch (error) {
      //mLog('erro: ', controlPointLine)
      //mLog(controlPoint.name)
      throw new Error(error);
   }
};

/**
 * Calcula o grau entre a latitude e longitude
 * @param {Number} deg grau
 */
const deg2rad = (deg) => deg * (Math.PI / 180);

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
   const R = 6371; // Radius of the earth in km
   const dLat = deg2rad(lat2 - lat1); // deg2rad below
   const dLon = deg2rad(lon2 - lon1);
   const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   const distance = R * c; // Distance in km

   return distance * 1000;
};
