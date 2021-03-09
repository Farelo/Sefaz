// COMMON
const STATES = require("../common/states");

// MODELS
const { Packing } = require("../../models/packings.model");
const { CurrentStateHistory } = require("../../models/current_state_history.model");

module.exports = async (packing) => {
   try {
      if (packing.last_detector_switch) { 
         if (packing.last_detector_switch.detector_switch) { 
            //If last_detector_switch is true, but packing.detector_switch is false yet:
            console.log(packing.detector_switch, !packing.detector_switch);
            if (!packing.detector_switch) { 
               await Packing.findByIdAndUpdate(packing._id, { detector_switch: true }, { new: true });
            }
         } else { 
            //If last_detector_switch is false, but packing.detector_switch is true yet:
            if (packing.detector_switch) { 
               await Packing.findByIdAndUpdate(packing._id, { detector_switch: false }, { new: true });

               await CurrentStateHistory.create({
                  packing: packing._id,
                  type: STATES.DISPOSITIVO_REMOVIDO.alert,
                  device_data_id: packing.last_detector_switch ? packing.last_detector_switch._id : null,
               });
            }
         }
      }
   } catch (error) {
      console.error(error);
      throw new Error(error);
   }
};
