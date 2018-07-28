const debug = require('debug')('job:common:model_operations')
const schemas = require("../../api/schemas/require_schemas")
const alerts_type = require('./alerts_type')
const historic_type = require('./historic_type')

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
        const update_packing = await schemas.packing.findByIdAndUpdate(packing._id, packing, options)
        debug(`Packing updated: ${packing._id}`)
    } catch (error) {
        debug('Failed to update packing in db.')
        throw new Error(error)
    }
}

module.exports.update_alert = async (packing, alert_type) => {
    try {
        const alert = await schemas.alert.find({ packing: packing._id, status: alert_type })

        if (alert.length > 0) {
            const update_alert = await schemas.alert.update({ packing: packing._id, status: alert_type }, {
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
            const new_alert = new schemas.alert({
                actual_plant: packing.actual_plant,
                department: packing.department,
                packing: packing._id,
                routes: packing.routes,
                project: packing.project,
                supplier: packing.supplier,
                status: alerts_type.BATTERY,
                hashpacking: packing.hashPacking,
                serial: packing.serial,
                date: new Date().getTime()
            })

            await new_alert.save()
            debug(`Alert created from packing: ${packing._id}`)
        }
    } catch (error) {
        debug('Failed to update alert in db.')
        throw new Error(error)
    }
}

module.exports.remove_alert = async (packing, alert_type) => {
    try {
        const alert = await schemas.alert.find({ packing: packing._id, status: alert_type })
        if (alert.length > 0) {
            const response = await schemas.alert.remove({packing: packing._id, status: alert_type })
            debug(`Alert removed from packing: ${packing._id}`)
        }
    } catch (error) {
        debug('Failed to update alert in db.')
        throw new Error(error)
    }
}

module.exports.create_historic = async (packing) => {
    try {
        const new_historic = await new schemas.historicPackings({
            actual_gc16: packing.actual_gc16,
            plant: packing.actual_plant,
            department: packing.department,
            date: packing.permanence.date,
            temperature: packing.temperature,
            permanence_time: packing.permanence.amount_days,
            serial: packing.serial,
            supplier: packing.supplier,
            packing: packing._id,
            packing_code: packing.code,
            status: historic_type.NORMAL
        })

        await new_historic.save()
        debug(`Historic created with success ${packing._id}`)
    } catch (error) {
        debug('Failed to create a historic in db.')
        throw new Error(error)
    }
}

module.exports.update_historic = async (packing) => {
    try {
        const update_historic = await schemas.historicPackings.update({ packing: packing._id, date: packing.permanence.date }, {
            actual_gc16: packing.actual_gc16,
            department: packing.department,
            plant: packing.actual_plant,
            date: packing.permanence.date,
            temperature: packing.temperature,
            permanence_time: packing.permanence.amount_days,
            serial: packing.serial,
            supplier: packing.supplier,
            packing: packing._id,
            packing_code: packing.code,
            status: historic_type.NORMAL
        })

        debug(`Historic updated with success ${packing._id}`)
    } catch (error) {
        debug('Failed to create a historic in db.')
        throw new Error(error)
    }
}

module.exports.update_packing_and_remove_actual_plant = async (packing) => {
    try {
        const update_packing = await schemas.packing.update({ "_id": packing._id }, { $unset: { 'actual_plant': 1, 'department': 1 } })
    } catch (error) {
        debug('Failed to update packing in db.')
        throw new Error(error)
    }
}
