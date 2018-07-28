const debug = require('debug')('job:common:model_operations')
const schemas = require("../../api/schemas/require_schemas")
const alerts_type = require('./alerts_type')

module.exports.find_all_packings_plants_and_setting = async () => {
    try {
        const packings = await schemas.packing.find({})
                            .populate('tag')
                            .populate('actual_plant.plant')
                            .populate('department')
                            .populate('supplier')
                            .populate('routes')
                            .populate('project')
                            .populate('gc16')
        const plants = await schemas.plant.find({}).populate('logistic_operator')
        const setting = await schemas.settings.findOne({ _id: 1 })

        const data = [packings, plants, setting]
        debug('All packings, plants and setting ok.')

        return data
    } catch (error) {
        debug('Failed to gel all packings, plants and setting ok.')        
        throw new Error(error)
    }
}

module.exports.update_devices = async (devices) => {
    try {
        let arrayOfPromises = []
        for (device of devices) {
            arrayOfPromises.push(schemas.packing.update({ code_tag: device.id }, device))
            // devices.forEach(device => arrayOfPromises.push(schemas.packing.update({ code_tag: device.id }, device)))
        }
        
        const response = await Promise.all(arrayOfPromises)
        debug(`Devices updated.`)
    } catch (error) {
        debug('Failed to update devices in db.')
        throw new Error(error)
    }
}

module.exports.update_packing = async (packing) => {
    const options = { new: true }
    try {
        const packing_updated = await schemas.packing.findByIdAndUpdate(packing._id, packing, options)
        debug(`Packing updated: ${packing._id}`)
    } catch (error) {
        debug('Failed to update packing in db.')
        throw new Error(error)
    }
}


module.exports.update_packing_and_remove_actual_plant = async (packing) => {
    try {
        const packing_updated = await schemas.packing.update({ "_id": packing._id }, { $unset: { 'actual_plant': 1, 'department': 1 } })
    } catch (error) {
        debug('Failed to update packing in db.')
        throw new Error(error)
    }
}

module.exports.update_alert_when_location_is_correct = async (packing) => {
    try {
        const alert = await schemas.alert.find({ packing: packing._id, status: alerts_type.INCORRECT_LOCAL })
        if (alert.length > 0) {
            const response = await schemas.alert.remove({packing: packing._id, status: alerts_type.INCORRECT_LOCAL })
            debug(`Alert removed from packing: ${packing._id}`)
        }
    } catch (error) {
        debug('Failed to update alert in db.')
        throw new Error(error)
    }
}

module.exports.update_alert_when_location_is_not_correct = async (packing) => {
    try {
        const alert = await schemas.alert.find({ packing: packing._id, status: alerts_type.INCORRECT_LOCAL })
        
        if (alert.length > 0) {
            const update_alert = await schemas.alert.update({ packing: packing._id, status: alerts_type.INCORRECT_LOCAL }, {
                department: packing.department,
                routes: packing.routes,
                project: packing.project,
                actual_plant: packing.actual_plant,
                supplier: packing.supplier,
                hashpacking: packing.hashPacking,
                serial: packing.serial
            })

            debug(`Alert updated from packing: ${packing._id}`)
        } else {
            const new_alert = await schemas.alert.create({
                department: packing.department,
                routes: packing.routes,
                actual_plant: packing.actual_plant,
                packing: packing._id,
                project: packing.project,
                supplier: packing.supplier,
                status: alerts_type.INCORRECT_LOCAL,
                hashpacking: packing.hashPacking,
                serial: packing.serial,
                date: new Date().getTime()
            })
            debug(`Alert created from packing: ${packing._id}`)
        }
    } catch (error) {
        debug('Failed to update alert in db.')
        throw new Error(error)
    }
}

