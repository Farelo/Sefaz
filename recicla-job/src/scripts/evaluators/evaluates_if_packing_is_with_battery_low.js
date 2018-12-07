// COMMON
const STATES = require('../common/states')

// MODELS
const { Packing } = require('../../models/packings.model')
const { AlertHistory } = require('../../models/alert_history.model')

module.exports = async (packing, setting) => {
  if (packing.last_device_data.battery.percentage < setting.battery_level_limit) {
    await Packing.findByIdAndUpdate(packing._id, { low_battery: true }, { new: true })

    if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.BATERIA_BAIXA.alert) return true
    await AlertHistory.create({ packing: packing._id, type: STATES.BATERIA_BAIXA.alert })

  } else {
    if (packing.low_battery) await Packing.findByIdAndUpdate(packing._id, { low_battery: false }, { new: true })
  }
}
