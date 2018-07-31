const debug = require('debug')('job:evaluators:evaluates_battery');
const modelOperations = require('../common/model_operations');
const alertsType = require('../common/alerts_type');

module.exports = async (packing, settings) => {
  if (packing.battery < settings.battery_level) {
    // A bateria da embalagem está acabando?
    debug(`Battery low! packing: ${packing._id}`);
    await modelOperations.update_alert(packing, alertsType.BATTERY);
  } else {
    debug('Battery ok!', packing._id);
    await modelOperations.remove_alert(packing, alertsType.BATTERY);
  }
};
