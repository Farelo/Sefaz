// COMMON
const STATES = require('../common/states')

// MODELS
const { Packing } = require('../../models/packings.model')
const { CurrentStateHistory } = require('../../models/current_state_history.model')

module.exports = async (packing, setting) => {
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
      await Packing.findByIdAndUpdate(packing._id, { low_battery: true }, { new: true })

      current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.BATERIA_BAIXA.alert })
      if (current_state_history) {
        //console.log("ESTADO DE BATERIA BAIXA JÁ CRIADO!")
      } else {
        await CurrentStateHistory.create({ packing: packing._id, type: STATES.BATERIA_BAIXA.alert, device_data_id: packing.last_device_data ? packing.last_device_data._id : null  })
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
