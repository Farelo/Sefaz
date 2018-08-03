const debug = require('debug')('job:evaluators:evaluates_incorrect_local');

module.exports = (packing, currentPlant) => {
  if (currentPlant.logistic_operator) {
    const stringOfSuppliers = currentPlant.logistic_operator.suppliers.map(supplier => String(supplier));
    const plant = packing.routes.filter(
      route => stringOfSuppliers.indexOf(String(route.supplier)) != 1,
    );
    const result = plant.length > 0;

    return result;
  }

  const plant = packing.routes.filter(
    route => route.plant_factory.equals(currentPlant._id) || route.plant_supplier.equals(currentPlant._id),
  );
  const result = plant.length > 0;

  return result;
};
