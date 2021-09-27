// COMMON
const STATES = require("../common/states");

// MODELS
const { Rack } = require("../../models/racks.model");
const { CurrentStateHistory } = require("../../models/current_state_history.model");

module.exports = async (rack, setting) => {
   let current_state_history = {};

   const battery_level = rack.last_battery ? rack.last_battery.battery : null;

   try {
      if (battery_level) {
         if (battery_level < setting.battery_level_limit) {
            await Rack.findByIdAndUpdate(rack._id, { low_battery: true }, { new: true });

            current_state_history = await CurrentStateHistory.findOne({
               rack: rack._id,
               type: STATES.BATERIA_BAIXA.alert,
            });
            
            if (current_state_history) {
               //console.log("ESTADO DE BATERIA BAIXA JÁ CRIADO!")
            } else {
               await CurrentStateHistory.create({
                  rack: rack._id,
                  type: STATES.BATERIA_BAIXA.alert,
                  device_data_id: rack.last_battery ? rack.last_battery._id : null,
               });
            }
         } else {
            if (rack.low_battery)
               await Rack.findByIdAndUpdate(rack._id, { low_battery: false }, { new: true });

            // current_state_history = await CurrentStateHistory.findOne({ rack: rack._id, type: STATES.BATERIA_BAIXA.alert })
            // if (current_state_history) {
            //   await current_state_history.remove()
            // } else {
            //   //console.log("ESTADO DE BATERIA BAIXA JÁ REMOVIDO!")
            // }
         }
      }
   } catch (error) {
      console.error(error);
      throw new Error(error);
   }
};
