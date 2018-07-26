const debug = require('debug')('job:evaluators:evaluates_battery')
const schemas = require("../../api/schemas/require_schemas")
const alerts_type = require('../common/alerts_type');

module.exports = async (packing, settings) => {
    if (packing.battery < settings.battery_level) { // A bateria da embalagem está acabando?
        debug(`Battery low packing_id: ${packing._id}`)
        let alert = await schemas.alert.find({ packing: packing._id, status: alerts_type.BATTERY })

        if (alert) {
            try {
                alert = await schemas.alert.update({ packing: packing._id, "status": alerts_type.BATTERY }, {
                    department: packing.department,
                    actual_plant: packing.actual_plant,
                    supplier: packing.supplier,
                    project: packing.project,
                    hashpacking: packing.hashPacking,
                    serial: packing.serial
                })

                debug(`Alert updated to packing: ${packing._id}`)
            } catch (error) {
                debug(`Something failed when updating an alert: ${error}`)
            }
        } else {
            try {
                const new_alert = new schemas.alert({
                    actual_plant: packing.actual_plant,
                    department: packing.department,
                    packing: packing._id,
                    supplier: packing.supplier,
                    project: packing.project,
                    status: alerts_type.BATTERY,
                    hashpacking: packing.hashPacking,
                    serial: packing.serial,
                    date: new Date().getTime()
                })

                alert = await new_alert.save()

                debug(`Alert created to packing: ${packing._id}`)
            } catch (error) {
                debug(`Something failed when creating a new alert: ${error}`)                
            }
        }
    } else {
        // Remove qualquer alerta de bateria referente a essa embalagem
        debug('Battery level ok!', packing._id)
        const alert = await schemas.alert.remove({ packing: packing._id, status: alerts_type.BATTERY })
    }
}
