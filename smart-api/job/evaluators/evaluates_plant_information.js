const debug = require('debug')('job:evaluators:evaluates_gc16');
const evaluatesPermanenceTime = require('../evaluators/evaluates_permanence_time');

/**
 * Define informações de permanencia e de estoque das embalagens
 * baseado no local em que a embalagem esta (Fabrica ou Fornecedor)
 * utilizando o registro GC16
 * @param {Object} currentPlant
 * @param {Packing} packing
 */
function definePermanenceDays(currentPlant, packing) {
  // avalia se a planta é de um fornecedor
  // se for avalia a informação do gc16 da embalagem
  // para a avaliar o tempo em que a mesma podera permanecer nessa planta
  if (currentPlant.supplier) {
    // ver a necessidade dessa avaliação
    if (currentPlant.supplier.equals(packing.supplier._id)) {
      if (packing.gc16) {
        packing.actual_gc16 = {
          days: packing.gc16.supplierStock.ssDays,
          max: packing.gc16.supplierStock.QuantContainerSsMax,
          min: packing.gc16.supplierStock.QuantContainerSs,
        };
        debug(`GC16 supplier added to packing: ${packing._id}`);
      }
    }
  } else if (packing.gc16) {
    packing.actual_gc16 = {
      days: packing.gc16.factoryStock.fsDays,
      max: packing.gc16.factoryStock.QuantContainerfsMax,
      min: packing.gc16.factoryStock.QuantContainerfs,
    };
    debug(`GC16 factory added to packing: ${packing._id}`);
  }

  return packing;
}

/**
 * Quando a embalagem perneceu no mesmo local a informação permanece
 * @param {Object} packing
 * @param {Object} currentPlant
 * @param {Object} department
 */
const fixed = (packing, currentPlant, department) => {
  // Verifica se o departamento atual existe e se existir ele verifica se está batendo com planta atual

  if (department.name) {
    // verifica se o departamento existe
    packing.department = department._id;
  } else if (packing.actual_plant && packing.department) {
    // avaliar a necessidade desse caso de teste
    if (!packing.actual_plant.plant._id.equals(packing.department.plant)) packing.department = null;
  } else {
    packing.department = null;
  }

  packing = definePermanenceDays(currentPlant, packing);

  packing = evaluatesPermanenceTime.same_plant(packing);
  // se atulizar a data, toda vez ela sempre estará em pouco tempo na fábrica
  //   packing.permanence.date = new Date().getTime();

  return packing;
};

/**
 * Atualiza a embalagem com as informações sobre
 * o novo local em que ela se apresenta
 * @param {Object} packing
 * @param {Object} currentPlant
 * @param {Object} department
 */
const changeLocation = (packing, currentPlant, department) => {
  // Verifica se o departamento atual existe e se existir ele verifica se está batendo com planta atual
  if (department.name) {
    packing.department = department._id;
  } else if (packing.actual_plant && packing.department) {
    if (!packing.actual_plant.plant._id.equals(packing.department.plant)) packing.department = null;
  } else {
    packing.department = null;
  }
  // retorna informações da embalagem sobre o tempo em que a mesma
  // deve permanecer em um local
  packing = definePermanenceDays(currentPlant, packing);

  // insere informações sobre a planta atual
  packing.actual_plant = {
    plant: currentPlant._id,
    local: currentPlant.supplier
      ? 'Supplier'
      : currentPlant.logistic_operator
        ? 'Logistic'
        : 'Factory',
  };

  // define as informações sobre o tempo de permanencia  da embalagem
  packing = evaluatesPermanenceTime.change_plant(packing);

  return packing;
};

/**
 * Avalia se a embalagem permaneceu na mesma planta que ela apresentava
 * e insere informações relevantes a embalagem sobre o local em que a mesma permanece
 * @param {Object} packing
 * @param {Object} currentPlant
 * @param {Object} currentDepartment
 */
module.exports = async (packing, currentPlant, currentDepartment) => {
  try {
    let editedPacking = {};
    // Avalia se a embalagem estava associada a alguma planta anteriomente
    if (packing.actual_plant.plant) {
      // Verifica se a embalagem está na mesma planta que ela estava anteriormente
      if (packing.actual_plant.plant.equals(currentPlant._id)) {
        editedPacking = fixed(packing, currentPlant, currentDepartment);
      } else {
        editedPacking = changeLocation(packing, currentPlant, currentDepartment);
      }

      debug('The actual_plant is ok!', editedPacking._id);

      return editedPacking;
    }
    // Casso contrario a embalagem não estava em nenhuma planta anteriormente então suas informações
    // são alteradas
    debug('The packing was not relationed with plant yet', editedPacking._id);
    editedPacking = changeLocation(packing, currentPlant, currentDepartment);

    return editedPacking;
  } catch (error) {
    debug('Something failed when evaluates gc16');
    throw new Error(error);
  }
};
