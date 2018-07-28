const debug = require('debug')('job:evaluators:evaluates_incorrect_local')

module.exports = (packing, current_plant) => {
    if (current_plant.logistic_operator) {
        const string_of_suppliers = current_plant.logistic_operator.suppliers.map(supplier => String(supplier))
        const plant = packing.routes.filter(route => string_of_suppliers.indexOf(String(route.supplier)) != 1)
        const result = plant.length > 0 ? true : false

        return result
    } else {
        const plant = packing.routes.filter(route => route.plant_factory.equals(current_plant._id) || route.plant_supplier.equals(current_plant._id))
        const result = plant.length > 0 ? true : false

        return result
    }
}