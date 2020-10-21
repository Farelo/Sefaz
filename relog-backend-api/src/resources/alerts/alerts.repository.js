const debug = require("debug")("repository:alerts");
const _ = require("lodash");
const moment = require("moment");

const { Family } = require("../families/families.model");
const { Packing } = require("../packings/packings.model");
const { ControlPoint } = require("../control_points/control_points.model");

exports.get_alerts = async () => {
   try {
      const families = await Family.find({}).populate("company", ["name", "type"]);

      let data = await Promise.all(
         families.map(async (family) => {
            let data_temp = [];

            const packings = await Packing.find({ active: true, family: family._id }).populate(
               "last_current_state_history"
            );
            const packings_with_battery_low = await Packing.find({
               active: true,
               family: family._id,
               low_battery: true,
            }).populate("last_current_state_history");
            
            const packings_with_permanence_time_exceeded = await Packing.find({
               active: true,
               family: family._id,
               permanence_time_exceeded: true,
            }).populate("last_current_state_history");

            data_temp = Object.entries(_.countBy(packings, "current_state")).map(([key, value]) => {
               return {
                  family_id: family._id,
                  family_code: family.code,
                  company: family.company,
                  current_state: key,
                  qtd: value,
               };
            });

            if (packings_with_battery_low.length > 0) {
               const battery_low = {
                  family_id: family._id,
                  family_code: family.code,
                  company: family.company,
                  current_state: "bateria_baixa",
                  qtd: packings_with_battery_low.length,
               };

               data_temp.push(battery_low);
            }

            if (packings_with_permanence_time_exceeded.length > 0) {
               const permanence_time_exceeded = {
                  family_id: family._id,
                  family_code: family.code,
                  company: family.company,
                  current_state: "tempo_de_permanencia_excedido",
                  qtd: packings_with_permanence_time_exceeded.length,
               };

               data_temp.push(permanence_time_exceeded);
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
      const packings =
         current_state === "bateria_baixa"
            ? await Packing.find({ active: true, family: family_id, low_battery: true })
                 .populate("family", "code")
                 .populate("last_position")
                 .populate("last_event_record")
                 .populate("last_current_state_history")
            : current_state === "tempo_de_permanencia_excedido"
            ? await Packing.find({ active: true, family: family_id, permanence_time_exceeded: true })
                 .populate("family", "code")
                 .populate("last_position")
                 .populate("last_event_record")
                 .populate("last_current_state_history")
            : await Packing.find({ active: true, family: family_id, current_state: current_state })
                 .populate("family", "code")
                 .populate("last_position")
                 .populate("last_event_record")
                 .populate("last_current_state_history");

      const data = await Promise.all(packings.map(map_last_event_record));

      return data;
   } catch (error) {
      throw new Error(error);
   }
};

const map_last_event_record = async (packing) => {
   if (!packing.last_event_record) return packing;

   let temp_obj = {};

   const control_point = await ControlPoint.findById(packing.last_event_record.control_point);

   temp_obj = packing;
   temp_obj.last_event_record.control_point = control_point;

   return temp_obj;
};
