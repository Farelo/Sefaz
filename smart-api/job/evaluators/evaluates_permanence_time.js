const debug = require('debug')('job:evaluators:evaluates_permancence_time');
const modelOperations = require('../common/model_operations');
const alertsType = require('../common/alerts_type');

/**
 * Avalia o tempo de permanencia sobre uma determinada embalagem
 * quando a mesma se apresenta no mesmo local
 * @param {Object} packing
 */
async function samePlant(packing, coorrectLocation = true) {
  let daysInMilliseconds = Infinity;
  const dateToday = new Date().getTime();
  // Avalia se o permanence date é igual a zero, pois isso indica que a mesma não estava presente
  // em nenhuma planta anteriormente
  const timeInterval = Math.round(dateToday - packing.permanence.date);

  // Avalia se a embalagem apresenta atual GC16 e esta no local correto
  if (packing.actual_gc16 && coorrectLocation) {
    daysInMilliseconds = 1000 * 60 * 60 * 24 * packing.actual_gc16.days; // milliseconds*seconds*minutes*hours*days

    packing.permanence.amount_days = timeInterval;

    // verifica se passou da quantidade de dias delimitados pelo GC16
    if (packing.permanence.amount_days > daysInMilliseconds) {
      debug(`Packing permanence exceeded. ${packing._id}`);
      packing.permanence.time_exceeded = true;
      await modelOperations.update_alert(packing, alertsType.PERMANENCE);

      return packing;
    }
    // Caso contrario a embalagem não ultrapassou dessa quantidade de dias
    debug(`Packing permanence time ok. ${packing._id}`);
    packing.permanence.time_exceeded = false;
    await modelOperations.remove_alert(packing, alertsType.PERMANENCE);

    return packing;
  }
  // se não apresentar, não é possivel inferir informações de permanencia sobre a embalagem
  packing.permanence.amount_days = timeInterval;
  packing.permanence.time_exceeded = false;
  return packing;
}

/**
 * Insere novas informações sobre o tempo de permanencia da embalagem
 * quando a mesma modificou o local
 * @param {Object} packing
 */
async function changePlant(packing) {
  debug('Remove permanence time from packing in local incorrect.');
  packing.permanence = {
    amount_days: 0,
    date: new Date().getTime(),
    time_exceeded: false,
  };
  await modelOperations.remove_alert(packing, alertsType.PERMANENCE);

  return packing;
}

/**
 * Avalia se a embalagem permaneceu na mesma planta que ela apresentava
 * e insere informações relevantes a embalagem sobre o local em que a mesma permanece
 * @param {Object} packing
 * @param {Object} currentPlant
 * @param {Object} coorrectLocation
 */
async function evaluate(packing, currentPlant, coorrectLocation) {
  try {
    let editedPacking = {};
    // Avalia se a embalagem estava associada a alguma planta anteriomente
    if (packing.actual_plant.plant) {
      // Verifica se a embalagem está na mesma planta que ela estava anteriormente
      if (packing.actual_plant.plant.equals(currentPlant._id)) {
        debug('Same Plant!', packing._id);
        editedPacking = await samePlant(packing, coorrectLocation);
      } else {
        debug('Change Plant!', packing._id);
        editedPacking = await changePlant(packing);
      }

      debug('The actual_plant is ok!', editedPacking._id);

      return editedPacking;
    }
    // Casso contrario a embalagem não estava em nenhuma planta anteriormente então suas informações
    // são alteradas
    debug('The packing was not relationed with plant yet', editedPacking._id);
    editedPacking = await changePlant(packing);

    return editedPacking;
  } catch (error) {
    debug('Something failed when evaluates gc16');
    throw new Error(error);
  }
}

module.exports = {
  evaluate,
};
