// COMMON
const STATES = require("../common/states");

// MODELS
const { CurrentStateHistory } = require('../../models/current_state_history.model')
const { Rack } = require('../../models/racks.model')
const { Family } = require('../../models/families.model')

const getLastPosition = (rack) => {
    if(rack.last_position) return rack.last_position 
    return null
}

module.exports = async (rack, currentControlPoint) => {
    try {
        const family = await Family.findById(rack.family)

        const itsOnFamilyControlPoint = family.control_points.find(cp => isIncorrectLocalWithControlPoints(cp, currentControlPoint))
        if (itsOnFamilyControlPoint !== undefined) {
            //console.log('EMBALAGEM ESTÁ EM UM LOCAL CORRETO')
            await Rack.findByIdAndUpdate(rack._id, { current_state: STATES.LOCAL_CORRETO.key }, { new: true })

            if (rack.last_current_state_history && rack.last_current_state_history.type === STATES.LOCAL_CORRETO.alert) return null
            await CurrentStateHistory.create({ rack: rack._id, type: STATES.LOCAL_CORRETO.alert, device_data_id: getLastPosition(rack) })
        } else {
            //console.log('EMBALAGEM ESTÁ EM UM LOCAL INCORRETO')
            await Rack.findByIdAndUpdate(rack._id, { current_state: STATES.LOCAL_INCORRETO.key }, { new: true })

            if (rack.last_current_state_history && rack.last_current_state_history.type === STATES.LOCAL_INCORRETO.alert) return null
            await CurrentStateHistory.create({ rack: rack._id, type: STATES.LOCAL_INCORRETO.alert, device_data_id: getLastPosition(rack)  })
        }
                
    } catch (error) {
        console.error(error)
        throw new Error(error)
    }
}

const isIncorrectLocal = (value, currentControlPoint) => {
    return value.toString() === currentControlPoint._id.toString()
}

const isIncorrectLocalWithControlPoints = (cp, currentControlPoint) => {
   if (cp.toString() === currentControlPoint._id.toString()) return true;
   else return false;
};
 