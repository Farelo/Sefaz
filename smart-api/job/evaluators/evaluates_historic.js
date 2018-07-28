const model_operations = require('../common/model_operations')

module.exports = (packing, current_plant) => {
    if (packing.actual_plant.plant && current_plant) {
        packing.actual_plant.plant.equals(current_plant._id) ?
            model_operations.update_historic(packing) : model_operations.create_historic(packing)
    } else {
        model_operations.create_historic(packing)
    }
}