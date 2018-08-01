const debug = require('debug')('job:evaluators:evaluates_current_department');
const schemas = require('../../api/schemas/require_schemas');
const geodesicDistance = require('../common/geodesicDistance');

/**
 * Retorna o departamento mais proximo utiulizando como referência
 * a localização da embalagem
 * @param {Object} packing Objeto seguindo o schema criado para embalagens
 * @param {Object} departments Objeto seguindo o schema criado para departamentos
 */
const getNearDepartment = (packing, departments) => {
  let distance = Infinity;
  let currentDepartment = {};

  departments.forEach((department) => {
    const calculate = geodesicDistance.getDistanceFromLatLonInKm(
      packing.position.latitude,
      packing.position.longitude,
      department.lat,
      department.lng,
    );
    if (calculate < distance) {
      distance = calculate;
      currentDepartment = department;
    }
  });

  return currentDepartment;
};

/**
 * Infere o departamento em que possivelmente a embalagem possa esta armazenada
 * @param {Object} packing Objeto seguindo o schema criado para embalagens
 * @param {Object} plant Objeto seguindo o schema criado para plantas
 */
module.exports = async (packing, plant) => {
  try {
    // Recupera todas os departamentos associados a planta
    const departments = await schemas.department.find({ plant: plant._id });

    if (departments.length > 0) {
      debug(`Exist department relationed to packing: ${packing._id}`);
      // recupera o departamento mais proximo da planta
      return getNearDepartment(packing, departments);
    }
    debug(`Does not exist department relationed to packing: ${packing._id}`);
    return null;
  } catch (error) {
    debug('Something failed when evaluates a current department');
    throw new Error(error);
  }
};
