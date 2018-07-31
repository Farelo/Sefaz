const geodesicDistance = require('../common/geodesicDistance');

/**
 *
 * @param {Object} packing Objeto seguindo o schema criado para embalagens
 * @param {Object} plants Objeto seguindo o schema criado para plantas
 * @param {Object} settings Objeto seguindo o schema criado para Configurações
 */
module.exports = (packing, plants, settings) => {
  let distance = Infinity;
  let currentPlant = {};

  plants.forEach((plant) => {
    const calculate = geodesicDistance.getDistanceFromLatLonInKm(
      packing.position.latitude,
      packing.position.longitude,
      plant.lat,
      plant.lng,
    );
    if (calculate < distance) {
      distance = calculate;
      currentPlant = plant;
    }
  });

  if (distance > settings.range_radius) {
    return null;
  }
  return currentPlant;
};
