const { Packing } = require('../../models/packings.model')

module.exports = async (packing, setting) => {
  if (packing.last_device_data.battery.percentage < setting.battery_level_limit) {
    await Packing.findOneAndUpdate({ _id: packing._id }, { low_battery: true }, { new: true })
  } else {
    if (packing.low_battery) await Packing.findOneAndUpdate({ _id: packing._id }, { low_battery: false }, { new: true })
  }
}
