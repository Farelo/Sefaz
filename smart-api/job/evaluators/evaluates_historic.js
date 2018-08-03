const modelOperations = require('../common/model_operations');
const historicType = require('../common/historic_type');

/**
 * Define qual o tipo de status atual da embalagem
 * @param {Object} packing
 */
function defineHistoricType(packing) {
  let status = historicType.NORMAL;

  if (packing.problem) {
    status = historicType.INCORRECT_LOCAL;
  } else if (packing.missing) {
    status = historicType.MISSING;
  } else if (packing.traveling) {
    status = historicType.TRAVELING;
  } else if (packing.trip.time_exceeded) {
    status = historicType.LATE;
  } else if (packing.actual_plant) {
    status = historicType.INCONTIDA;
  }

  return status;
}

async function init(packing, oldPlant, currentPlant) {
  if (oldPlant && currentPlant) {
    if (oldPlant.equals(currentPlant._id)) {
      await modelOperations.update_historic(packing, defineHistoricType(packing));
    } else {
      await modelOperations.create_historic(packing, defineHistoricType(packing));
    }
  } else {
    await modelOperations.create_historic(packing, defineHistoricType(packing));
  }
}

module.exports = { init };
