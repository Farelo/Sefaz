const debug = require('debug')('job:evaluators:evaluates_traveling');
const modelOperations = require('../common/model_operations');
const alertsType = require('../common/alerts_type');

/**
 * Avalia se a embalagem esta em viagem, atraso ou ausente
 * @param {Object} packing Objeto equivalente ao modelo definido pelo schema de embalagem
 */
module.exports = async (packing) => {
  try {
    let dateToday = new Date().getTime();
    let timeTnterval = Math.floor(dateToday - packing.trip.date);
    const missingRoutes = packing.routes.filter(
      route => timeTnterval > route.time.max + route.time.to_be_late,
    );

    if (missingRoutes.length > 0) {
      debug(`Packing is missing! ${packing._id}`);

      packing.problem = false;
      packing.traveling = false;
      packing.missing = true;
      packing.packing_missing = {
        date: packing.packing_missing.date,
        time_countdown: timeTnterval,
      };
      packing.trip = {
        time_exceeded: true,
        time_countdown: timeTnterval,
      };

      await modelOperations.update_alert(packing, alertsType.MISSING);
      // historic.update_from_alert(packing, historic_types.MISSING, packing.packing_missing.date, packing.packing_missing.time_countdown)

      return packing;
    }
    dateToday = new Date().getTime();
    timeTnterval = Math.floor(dateToday - packing.trip.date);
    const lateRoutes = packing.routes.filter(route => timeTnterval > route.time.max);

    if (lateRoutes.length > 0) {
      debug(`Packing is late! ${packing._id}`);

      packing.problem = false;
      packing.traveling = false;
      packing.missing = false;
      packing.packing_missing = {
        date: 0,
        time_countdown: 0,
      };
      packing.trip = {
        time_exceeded: true,
        time_countdown: timeTnterval,
      };

      await modelOperations.update_alert(packing, alertsType.LATE);

      return packing;
    }
    debug(`Packing is traveling! ${packing._id}`);
    packing.problem = false;
    packing.traveling = true;
    packing.missing = false;
    packing.packing_missing = {
      date: 0,
      time_countdown: 0,
    };
    packing.trip = {
      time_exceeded: false,
      time_countdown: timeTnterval,
    };
    packing.permanence = {
      amount_days: 0,
      date: 0,
      time_exceeded: false,
    };

    await modelOperations.remove_alert(packing, alertsType.MISSING);
    await modelOperations.remove_alert(packing, alertsType.LATE);

    return packing;
  } catch (error) {
    debug(`Failed to evaluates traveling of packing : ${packing._id}`);
    throw new Error(error);
  }
};
