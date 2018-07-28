const debug = require('debug')('job:evaluators:evaluates_battery')
const model_operations = require('../common/model_operations')
const alerts_type = require('../common/alerts_type');

module.exports = async (packing, settings) => {
    if (packing.battery < settings.battery_level) { // A bateria da embalagem está acabando?
        debug(`Battery low! packing: ${packing._id}`)
        await model_operations.update_alert(packing, alerts_type.BATTERY)
    } else {
        debug('Battery ok!', packing._id)
        await model_operations.remove_alert(packing, alerts_type.BATTERY)
    }
}
