const debug = require('debug')('job:evaluators:evaluates_permancence_time');
const modelOperations = require('../common/model_operations');
const alertsType = require('../common/alerts_type');

/**
 * Avalia o tempo de permanencia sobre uma determinada embalagem
 * quando a mesma se apresenta no mesmo local
 * @param {Object} packing
 */
module.exports.same_plant = async (packing) => {
  let daysInMilliseconds = Infinity;
  const dateToday = new Date().getTime();
  const timeInterval = Math.round(dateToday - packing.permanence.date);

  // Avalia se a embalagem apresenta atual GC16
  if (packing.actual_gc16) {
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
};

/**
 * Insere novas informações sobre o tempo de permanencia da embalagem
 * quando a mesma modificou o local
 * @param {Object} packing
 */
module.exports.change_plant = async (packing) => {
  debug('Remove permanence time from packing in local incorrect.');
  packing.permanence = {
    amount_days: 0,
    date: new Date().getTime(),
    time_exceeded: false,
  };
  await modelOperations.remove_alert(packing, alertsType.PERMANENCE);

  return packing;
};
