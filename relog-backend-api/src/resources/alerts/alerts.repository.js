const debug = require("debug")("repository:alerts");
const _ = require("lodash");
const moment = require("moment");

const { Family } = require("../families/families.model");
const { Rack } = require("../racks/racks.model");
const { ControlPoint } = require("../control_points/control_points.model");

exports.get_alerts = async () => {
   try {
      const families = await Family.find({}).populate("company", ["name", "type"]);

      let data = await Promise.all(
         families.map(async (family) => {
            let data_temp = [];

            const racks = await Rack.find({ active: true, family: family._id }).populate(
               "last_current_state_history"
            );
            const racks_with_battery_low = await Rack.find({
               active: true,
               family: family._id,
               low_battery: true,
            }).populate("last_current_state_history");


            const racks_with_button_false = await Rack.find({
               active: true,
               family: family._id,
               detector_switch: false,
            }).populate("last_current_state_history");
            
            const racks_with_permanence_time_exceeded = await Rack.find({
               active: true,
               family: family._id,
               permanence_time_exceeded: true,
            }).populate("last_current_state_history");

            data_temp = Object.entries(_.countBy(racks, "current_state")).map(([key, value]) => {
               return {
                  family_id: family._id,
                  family_code: family.code,
                  company: family.company,
                  current_state: key,
                  qtd: value,
               };
            });

            if (racks_with_battery_low.length > 0) {
               const battery_low = {
                  family_id: family._id,
                  family_code: family.code,
                  company: family.company,
                  current_state: "bateria_baixa",
                  qtd: racks_with_battery_low.length,
               };

               data_temp.push(battery_low);
            }

            if (racks_with_permanence_time_exceeded.length > 0) {
               const permanence_time_exceeded = {
                  family_id: family._id,
                  family_code: family.code,
                  company: family.company,
                  current_state: "tempo_de_permanencia_excedido",
                  qtd: racks_with_permanence_time_exceeded.length,
               };

               data_temp.push(permanence_time_exceeded);
            }

            if (racks_with_button_false.length > 0) {
               const buttonFalse = {
                  family_id: family._id,
                  family_code: family.code,
                  company: family.company,
                  current_state: "dispositivo_removido",
                  qtd: racks_with_button_false.length,
               };

               data_temp.push(buttonFalse);
            }

            return data_temp;
         })
      );

      return _.flatMap(data);
   } catch (error) {
      throw new Error(error);
   }
};

exports.get_alerts_by_family = async (family_id, current_state) => {
   try {

      let racks = [];
      if(current_state === "bateria_baixa"){
         racks = await Rack.find({ active: true, family: family_id, low_battery: true }, { tag: 1, family: 1, serial: 1, last_event_record: 1, last_current_state_history: 1, last_position: 1, last_battery: 1})
         .populate("family", "code")
         .populate("last_position", "date timestamp latitude longitude accuracy")
         .populate("last_battery", "date timestamp battery batteryVoltage")
         .populate("last_event_record", "control_point type created_at")
         .populate("last_current_state_history", "type created_at")
      }else if(current_state === "tempo_de_permanencia_excedido"){
         racks = await Rack.find({ active: true, family: family_id, permanence_time_exceeded: true }, { tag: 1, family: 1, serial: 1, last_event_record: 1, last_current_state_history: 1, last_position: 1, last_battery: 1})
         .populate("family", "code")
         .populate("last_position", "date timestamp latitude longitude accuracy")
         .populate("last_battery", "date timestamp battery batteryVoltage")
         .populate("last_event_record", "control_point type created_at")
         .populate("last_current_state_history", "type created_at")
      }else if(current_state === "dispositivo_removido"){
         racks = await Rack.find({ active: true, family: family_id, detector_switch: false }, { tag: 1, family: 1, serial: 1, last_event_record: 1, last_current_state_history: 1, last_position: 1, last_battery: 1})
         .populate("family", "code")
         .populate("last_position", "date timestamp latitude longitude accuracy")
         .populate("last_battery", "date timestamp battery batteryVoltage")
         .populate("last_event_record", "control_point type created_at")
         .populate("last_current_state_history", "type created_at")
      }else{
         racks = await Rack.find({ active: true, family: family_id, current_state: current_state }, { tag: 1, family: 1, serial: 1, last_event_record: 1, last_current_state_history: 1, last_position: 1, last_battery: 1})
         .populate("family", "code")
         .populate("last_position", "date timestamp latitude longitude accuracy")
         .populate("last_battery", "date timestamp battery batteryVoltage")
         .populate("last_event_record", "control_point type created_at")
         .populate("last_current_state_history", "type created_at");
      }

      const data = await Promise.all(racks.map(map_last_event_record));

      return data;
   } catch (error) {
      throw new Error(error);
   }
};

const map_last_event_record = async (rack) => {
   if (!rack.last_event_record) return rack;

   let temp_obj = {};

   const control_point = await ControlPoint.findById(rack.last_event_record.control_point, { name: 1 });

   temp_obj = rack;
   temp_obj.last_event_record.control_point = control_point;

   return temp_obj;
};
