// COMMON
const STATES = require('../common/states')

// MODELS
const { Packing } = require('../../models/packings.model')
const { AlertHistory } = require('../../models/alert_history.model')

module.exports = async (packing, setting) => {
  if (packing.last_device_data.battery.percentage < setting.battery_level_limit) {
    await Packing.findOneAndUpdate({ _id: packing._id }, { low_battery: true }, { new: true })
    await AlertHistory.create({ packing: packing._id, type: STATES.BATERIA_BAIXA.alert })
  } else {
    if (packing.low_battery) await Packing.findOneAndUpdate({ _id: packing._id }, { low_battery: false }, { new: true })
  }
}
