const modelOperations = require('../common/model_operations');

module.exports = (packing, currentPlant) => {
  if (packing.actual_plant.plant && currentPlant) {
    if (packing.actual_plant.plant.equals(currentPlant._id)) {
      modelOperations.update_historic(packing);
    } else {
      modelOperations.create_historic(packing);
    }
  } else {
    modelOperations.create_historic(packing);
  }
};
