// COMMON
const STATES = require("../common/states");

// MODELS
const { CurrentStateHistory } = require("../../models/current_state_history.model");
const { Packing } = require("../../models/packings.model");
const { Family } = require("../../models/families.model");
const factStateMachine = require("../../models/fact_state_machine.model");

const getLastPosition = (packing) => {
    if(packing.last_position) return packing.last_position 
    return null
}

module.exports = async (packing, currentControlPoint) => {
    try {
        const family = await Family.findById(packing.family)

        const itsOnFamilyControlPoint = family.control_points.find(cp => isIncorrectLocalWithControlPoints(cp, currentControlPoint))
        if (itsOnFamilyControlPoint !== undefined) {
            //console.log('EMBALAGEM ESTÁ EM UM LOCAL CORRETO')
            await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.LOCAL_CORRETO.key }, { new: true })

            if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.LOCAL_CORRETO.alert) return null
            await CurrentStateHistory.create({ packing: packing._id, type: STATES.LOCAL_CORRETO.alert, device_data_id: getLastPosition(packing) })
        } else {
            //console.log('EMBALAGEM ESTÁ EM UM LOCAL INCORRETO')
            await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.LOCAL_INCORRETO.key }, { new: true })

            if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.LOCAL_INCORRETO.alert) return null
            await CurrentStateHistory.create({ packing: packing._id, type: STATES.LOCAL_INCORRETO.alert, device_data_id: getLastPosition(packing)  })
        }
                
    } catch (error) {
        console.error(error)
        throw new Error(error)
    }
}

const isIncorrectLocal = (value, currentControlPoint) => {
   return value.toString() === currentControlPoint._id.toString();
};

const isIncorrectLocalWithControlPoints = (cp, currentControlPoint) => {
   if (cp.toString() === currentControlPoint._id.toString()) return true;
   else return false;
};
 
