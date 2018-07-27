const debug = require('debug')('job:common:model_operations')
const schemas = require("../../api/schemas/require_schemas")

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
        
    }
}

module.exports.update_devices = async (devices) => {
    try {
        let arrayOfPromises = []
        devices.forEach(device => arrayOfPromises.push(schemas.packing.update({ code_tag: device.id }, device)))
        
        const response = await Promise.all(arrayOfPromises)
        debug(`Devices updated.`)
    } catch (error) {
        throw new Error('Failed to update devices in db: ', error)
        debug('Failed to update devices in db.')
    }
}