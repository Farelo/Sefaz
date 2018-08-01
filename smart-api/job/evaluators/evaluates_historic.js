const modelOperations = require('../common/model_operations');

async function init(packing, currentPlant) {
  if (packing.actual_plant.plant && currentPlant) {
    if (packing.actual_plant.plant.equals(currentPlant._id)) {
      await modelOperations.update_historic(packing);
    } else {
      await modelOperations.create_historic(packing);
    }
  } else {
    await modelOperations.create_historic(packing);
  }
}

module.exports = { init };
