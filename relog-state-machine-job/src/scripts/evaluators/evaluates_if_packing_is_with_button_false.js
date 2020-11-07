// COMMON
const STATES = require("../common/states");

// MODELS
const { Packing } = require("../../models/packings.model");
const { CurrentStateHistory } = require("../../models/current_state_history.model");

module.exports = async (packing) => {
   let current_state_history = {};

   // TEM ERRO NESTA LINHA, ESTA PUXANDO ERRADO
   const detector_switch = packing.last_detector_switch ? packing.last_detector_switch : null;

   try {
      if (detector_switch) {
         if (detector_switch == true) {
            await Packing.findByIdAndUpdate(packing._id, { detector_switch: true }, { new: true });

            current_state_history = await CurrentStateHistory.findOne({
               packing: packing._id,
               type: STATES.DISPOSITIVO_REMOVIDO.alert,
            });
            
            if (current_state_history) {
               
            } else {
               await CurrentStateHistory.create({
                  packing: packing._id,
                  type: STATES.DISPOSITIVO_REMOVIDO.alert,
                  device_data_id: packing.last_detector_switch ? packing.last_detector_switch._id : null,
               });
            }
         } else {
            if (packing.detector_switch)
               await Packing.findByIdAndUpdate(packing._id, { detector_switch: false }, { new: true });
         }
      }
   } catch (error) {
      console.error(error);
      throw new Error(error);
   }
};
