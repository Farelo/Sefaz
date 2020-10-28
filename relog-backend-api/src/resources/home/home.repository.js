const debug = require("debug")("repository:home");
const _ = require("lodash");
const moment = require("moment");
const { Company } = require("../companies/companies.model");
const { ControlPoint } = require("../control_points/control_points.model");
const { EventRecord } = require("../event_record/event_record.model");
const { Family } = require("../families/families.model");
const { Packing } = require("../packings/packings.model");
const { GC16 } = require("../gc16/gc16.model");
const { Setting } = require("../settings/settings.model");

const getLastBattery = (packing) => {
   return packing.last_battery ? packing.last_battery.battery : null;
};

const getLastPosition = (packing) => {
   return packing.last_position ? packing.last_position : null;
};

exports.home_report = async (current_state = null) => {
   try {
      const packings = current_state
         ? await Packing.find({ active: true, current_state: current_state })
              .populate("family")
              .populate("last_event_record")
              .populate("last_position")
              .populate("last_battery")
              .populate("last_temperature")
         : await Packing.find({ active: true })
              .populate("family")
              .populate("last_event_record")
              .populate("last_position")
              .populate("last_battery")
              .populate("last_temperature");

      if (current_state) {
         return Promise.all(
            packings.map(async (packing) => {
               let obj_temp = {};

               const current_control_point = packing.last_event_record
                  ? await ControlPoint.findById(packing.last_event_record.control_point).populate("type")
                  : null;
               const battery_level = getLastBattery(packing);

               obj_temp.familyCode = packing.family ? packing.family.code : null;
               obj_temp.serial = packing.serial;
               obj_temp.tag = packing.tag.code;

               obj_temp.currentControlPointName = current_control_point
                  ? current_control_point.name
                  : null;

               obj_temp.itemLate.currentControlPointType = current_control_point
                  ? current_control_point.type.name
                  : null;

               obj_temp.battery_percentage = battery_level;
               obj_temp.accuracy = getLastPosition(packing) ? getLastPosition(packing).accuracy : "Sem registro";

               obj_temp.date = packing.last_message_signal
                  ? `${moment(packing.last_message_signal).locale("pt-br").format("L")} ${moment(
                       packing.last_message_signal
                    )
                       .locale("pt-br")
                       .format("LT")}`
                  : "Sem registro";

               return obj_temp;
            })
         );
      } else {
         let data = {};
         const qtd_in_traveling = await Packing.find({ current_state: "viagem_em_prazo", active: true }).count();
         const qtd_in_traveling_late = await Packing.find({ current_state: "viagem_atrasada", active: true }).count();
         const qtd_in_traveling_missing = await Packing.find({ current_state: "viagem_perdida", active: true }).count();
         const qtd_in_correct_cp = await Packing.find({ current_state: "local_correto", active: true }).count();
         const qtd_in_incorrect_cp = await Packing.find({ current_state: "local_incorreto", active: true }).count();

         const packings_low_battery = await Packing.find({ active: true, low_battery: true })
            .select(["_id", "current_state"])
            .count();
         const packings_permanence_time_exceeded = await Packing.find({ active: true, permanence_time_exceeded: true })
            .select(["_id", "current_state"])
            .count();

         data.qtd_total = packings.length;
         data.qtd_in_cp = qtd_in_correct_cp + qtd_in_incorrect_cp;
         data.qtd_in_traveling = qtd_in_traveling + qtd_in_traveling_late + qtd_in_traveling_missing;
         data.qtd_in_incorrect_cp = qtd_in_incorrect_cp;
         data.qtd_permanence_time_exceeded = packings_permanence_time_exceeded;
         data.qtd_traveling_late = qtd_in_traveling_late;
         data.qtd_traveling_missing = qtd_in_traveling_missing;
         data.qtd_with_low_battery = packings_low_battery;

         return data;
      }
   } catch (error) {
      throw new Error(error);
   }
};

exports.home_low_battery_report = async () => {
   try {
      const packings = await Packing.find({ active: true, low_battery: true })
         .populate("family")
         .populate("last_position")
         .populate("last_battery")
         .populate("last_event_record");

      return Promise.all(
         packings.map(async (packing) => {
            let obj_temp = {};

            const current_control_point = packing.last_event_record
               ? await ControlPoint.findById(packing.last_event_record.control_point).populate("type")
               : null;
            const lastBattery = getLastBattery(packing);

            obj_temp.id = packing._id;
            obj_temp.familyCode = packing.family ? packing.family.code : null;
            obj_temp.serial = packing.serial;
            obj_temp.tag = packing.tag.code;
            obj_temp.currentControlPointName = current_control_point ? current_control_point.name : null;

            obj_temp.currentControlPointType = current_control_point ? current_control_point.type.name : null;

            obj_temp.battery_percentage = lastBattery ? lastBattery.battery : null;
            obj_temp.lastBattery = packing.last_battery;

            return obj_temp;
         })
      );
   } catch (error) {
      throw new Error(error);
   }
};

exports.home_permanence_time_exceeded_report = async () => {
   try {
      const packings = await Packing.find({ active: true, permanence_time_exceeded: true })
         .populate("family")
         .populate("last_position")
         .populate("last_battery")
         .populate("last_event_record");

      return Promise.all(
         packings.map(async (packing) => {
            let obj_temp = {};

            const current_control_point = packing.last_event_record
               ? await ControlPoint.findById(packing.last_event_record.control_point).populate("type")
               : null;

            obj_temp.id = packing._id;
            obj_temp.familyCode = packing.family ? packing.family.code : null;
            obj_temp.serial = packing.serial;
            obj_temp.tag = packing.tag.code;
            obj_temp.currentControlPointName = current_control_point ? current_control_point.name : null;
            obj_temp.currentControlPointType = current_control_point ? current_control_point.type.name : null; 
            obj_temp.date = packing.last_position
               ? `${moment(packing.last_position.date).locale("pt-br").format("L")} ${moment(packing.last_position.date)
                    .locale("pt-br")
                    .format("LT")}`
               : null;

            return obj_temp;
         })
      );
   } catch (error) {
      throw new Error(error);
   }
};
