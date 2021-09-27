// COMMON
const STATES = require("../common/states");

// MODELS
const { Rack } = require("../../models/racks.model");
const { CurrentStateHistory } = require("../../models/current_state_history.model");

module.exports = async (rack) => {
   try {
      if (rack.last_detector_switch) { 
         if (rack.last_detector_switch.detector_switch) { 
            //If last_detector_switch is true, but rack.detector_switch is false yet:
            console.log(rack.detector_switch, !rack.detector_switch);
            if (!rack.detector_switch) { 
               await Rack.findByIdAndUpdate(rack._id, { detector_switch: true }, { new: true });
            }
         } else { 
            //If last_detector_switch is false, but rack.detector_switch is true yet:
            if (rack.detector_switch) { 
               await Rack.findByIdAndUpdate(rack._id, { detector_switch: false }, { new: true });

               await CurrentStateHistory.create({
                  rack: rack._id,
                  type: STATES.DISPOSITIVO_REMOVIDO.alert,
                  device_data_id: rack.last_detector_switch ? rack.last_detector_switch._id : null,
               });
            }
         }
      }
   } catch (error) {
      console.error(error);
      throw new Error(error);
   }
};
