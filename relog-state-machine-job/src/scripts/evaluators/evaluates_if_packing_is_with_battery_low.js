// COMMON
const STATES = require('../common/states')

// MODELS
const { Packing } = require('../../models/packings.model')
const { CurrentStateHistory } = require('../../models/current_state_history.model')
const factStateMachine = require('../../models/fact_state_machine.model')

module.exports = async (packing, setting, companies) => {
  let current_state_history = {}
  
  const battery_level = packing.last_device_data.battery.percentage !== null ? packing.last_device_data.battery.percentage : packing.last_device_data_battery ? packing.last_device_data_battery.battery.percentage : null

  // if(packing.last_device_data.battery.percentage !== null)
  //   battery_level = packing.last_device_data.battery.percentage
  // else
  //   if(packing.last_device_data_battery)
  //     packing.last_device_data_battery.battery.percentage
  //   else
  //     null

  try {
    if ((battery_level !== null) && (battery_level < setting.battery_level_limit)) {

      if(packing.low_battery == false){
        await Packing.findByIdAndUpdate(packing._id, { low_battery: true }, { new: true })

        const newCurrentStateHistory = new CurrentStateHistory({ packing: packing._id, type: STATES.BATERIA_BAIXA.alert });
        await newCurrentStateHistory.save();
        
        console.log("[generateNewFact] BATERIA_BAIXA @31");
        await factStateMachine.generateNewFact(packing, null, newCurrentStateHistory, companies);
      }

    } else {
      if (packing.low_battery) await Packing.findByIdAndUpdate(packing._id, { low_battery: false }, { new: true })

      // current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.BATERIA_BAIXA.alert })
      // if (current_state_history) {
      //   await current_state_history.remove()
      // } else {
      //   //console.log("ESTADO DE BATERIA BAIXA JÁ REMOVIDO!")
      // }
    }
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}
