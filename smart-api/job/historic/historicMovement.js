const schemas = require('../../api/schemas/require_schemas');
const geodesicDistance = require('../common/geodesicDistance');
const debug = require('debug')('job:historicMovement');

/**
 * Cria o historico de movimentação da embalagem no sistema
 * @param {Object} packing
 * @param {String} status
 */
async function createHistoricMovement(packing, status) {
  const newHistoric = await new schemas.historyMovement({
    department: packing.department,
    plant: packing.actual_plant,
    date: new Date().getTime(),
    temperature: packing.temperature,
    permanence: 0,
    serial: packing.serial,
    supplier: packing.supplier,
    packing: packing._id,
    packing_code: packing.code,
    latitude: packing.position.latitude,
    longitude: packing.position.longitude,
    accuracy: packing.position.accuracy,
    battery: packing.battery,
    status,
  });
  await newHistoric.save();
  debug(`Historic Movement created with success ${packing._id}`);
}

/**
 * Atualiza as informações sobre a movimentação da embalagem
 * @param {Object} packing
 * @param {String} status
 * @param {ObjectId} id
 * @param {Number} permanence
 */
async function updateHistoricMovement(packing, status, id, permanence) {
  await schemas.historyMovement.update(
    {
      _id: id,
    },
    {
      department: packing.department,
      plant: packing.actual_plant,
      temperature: packing.temperature,
      permanence,
      serial: packing.serial,
      supplier: packing.supplier,
      packing: packing._id,
      packing_code: packing.code,
      battery: packing.battery,
      status,
    },
  );

  debug(`Historic Movement updated with success ${packing._id}`);
}

async function verifyMovementPacking(packing, status) {
  const historic = await schemas.historyMovement
    .find({ packing: packing._id })
    .sort({ date: -1 })
    .limit(1);
  let distance = Infinity;

  if (historic.length) {
    distance = geodesicDistance.getDistanceFromLatLonInKm(
      historic[0].latitude,
      historic[0].longitude,
      packing.position.latitude,
      packing.position.longitude,
    );
  }

  if (distance >= 0.05) {
    await createHistoricMovement(packing, status);
  } else {
    const baseDate = new Date().getTime();
    const permanence = baseDate - historic[0].date;
    await updateHistoricMovement(packing, status, historic[0]._id, permanence);
  }
}

module.exports = {
  createHistoricMovement,
  updateHistoricMovement,
  verifyMovementPacking,
};
