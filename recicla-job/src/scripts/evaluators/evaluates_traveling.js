const debug = require('debug')('job:evaluators:evaluates_traveling');
const modelOperations = require('../common/model_operations');
const alertsType = require('../common/alerts_type');
const cleanObject = require('../common/cleanObject');
const historic = require('../historic/historic');
const historicType = require('../common/historic_type');
const statusType = require('../common/status_type');
const statusTypePt = require('../common/status_type_pt');

/**
 * Verifica se a embalagem esta atrasada
 * @param {Object} packing
 * @param {Number} timeTnterval
 */
function isLate(packing, timeTnterval) {
  // Seria bom descobrir para qual das rotas essa embalagem esta a caminho
  // pega o tempo maximo base entre as rotas para definir que a embalagem esta atrasada
  const timeBase = packing.routes.reduce((prev, next) => Math.max(prev, next.time.max), 0);
  const lateRoutes = timeTnterval > timeBase;

  return lateRoutes;
}
/**
 * Verifica se a embalagem esta ausente
 * @param {Object} packing
 * @param {Number} timeTnterval
 */
function isMissing(packing, timeTnterval) {
  // Seria bom descobrir para qual das rotas essa embalagem esta a caminho
  // Pega o tempo maximo entre as rotas e associa ao to be late para gerar o tempo de referência
  // de atraso
  const timeBase = packing.routes.reduce(
    (prev, next) => Math.max(prev, next.time.max + next.time.to_be_late),
    0,
  );

  // verifica quais das rotas da embalagem foi ultrapassado o tempo max
  const missingRoutes = timeTnterval > timeBase;

  return missingRoutes;
}
/**
 * Avalia se a embalagem esta em viagem, atraso ou ausente
 * @param {Object} packing Objeto equivalente ao modelo definido pelo schema de embalagem
 */
module.exports = async (packing) => {
  const dateToday = new Date().getTime();

  try {
    // verifica se a mesma estava com a FLAG de perdida antes
    if (!packing.missing) {
      // se não estava , entra nesse fluxo
      if (packing.trip.date !== 0) {
        // Avalia se o mesmo ja entrou em viage
        const timeTnterval = Math.floor(dateToday - packing.trip.date);
        packing.trip.time_countdown = timeTnterval;
        // Verifica se a embalagem ultrapassou o tempo maximo das rotas
        if (isMissing(packing, timeTnterval)) {
          // Nesse fluxo so pode ser gerada os alertas relacionados a uma embalagem que esta perdida
          debug(`Packing is missing! ${packing._id}`);
          packing.status = statusType.MISSING;
          packing.status_pt = statusTypePt.MISSING;
          packing = cleanObject.cleanFlags(packing);
          packing = cleanObject.cleanPermanence(packing);
          packing.missing = true;

          packing.packing_missing = {
            date: new Date().getTime(),
            time_countdown: 0,
          };
          packing.trip.time_exceeded = false;

          await modelOperations.update_alert(packing, alertsType.MISSING);
          await modelOperations.remove_alert(packing, alertsType.LATE);
          // historic.update_from_alert(packing, historic_types.MISSING, packing.packing_missing.date, packing.packing_missing.time_countdown)
          await historic.createMissingStatus(packing);
          return packing;
        }
        // avalia se a embalagem realmente esta atrasada
        if (isLate(packing, timeTnterval)) {
          debug(`Packing is late! ${packing._id}`);
          packing = cleanObject.cleanFlags(packing);
          packing = cleanObject.cleanPermanence(packing);
          packing = cleanObject.cleanMissing(packing);
          packing.status = statusType.LATE;
          packing.status_pt = statusTypePt.LATE;
          if (packing.trip.time_exceeded) {
            // medida provisória ja que ja existia algumas informações na base antiga
            if (!packing.trip.date_late) packing.trip.date_late = dateToday;
            packing.trip.time_late = Math.floor(dateToday - packing.trip.date_late);
            await historic.updateLateStatus(packing);
          } else {
            packing.trip.time_exceeded = true;
            packing.trip.date_late = new Date().getTime();
            packing.trip.time_late = 0;
            await historic.createLateStatus(packing);
          }

          await modelOperations.update_alert(packing, alertsType.LATE);
          return packing;
        }
        // verifica se ele não estava true antes , no caso
        // houve alguma alteração e forçou o mesmo a ir para false

        if (packing.trip.time_exceeded) {
          packing.trip.time_exceeded = false;
          // remove antes de realizar a alteraçõa
          await historic.removeHistoric(packing, packing.trip.date_late, historicType.LATE);
          packing.trip.date_late = 0;
          packing.trip.time_late = 0;
        }

        // TODO: Remover esse código e colar esse await historic.updateTravelingStatus(packing);
        if (!packing.trip.date) {
          packing = cleanObject.cleanTrip(packing);
          packing.trip.date = new Date().getTime();
          packing.status = statusType.TRAVELING;
          packing.status_pt = statusTypePt.TRAVELING;
          await historic.createTravelingStatus(packing);
        } else {
          packing.status = statusType.TRAVELING;
          packing.status_pt = statusTypePt.TRAVELING;
          await historic.updateTravelingStatus(packing);
        }

        // caso nenhuma das considerações sejam aceitas, então
        // a embalagem não esta mais atrasada e tambem não esta perdida (O segundo caso mais
        // dificil de acontecer)
        await modelOperations.remove_alert(packing, alertsType.LATE);
        return packing;
      }
      debug(`Packing is traveling! ${packing._id}`);

      // Limpa todas as informações que podem esta associadas a embalagem anteriormente
      packing = cleanObject.cleanFlags(packing);
      packing = cleanObject.cleanPermanence(packing);
      packing = cleanObject.cleanMissing(packing);
      packing = cleanObject.cleanTrip(packing);
      packing.traveling = true;
      packing.status = statusType.TRAVELING;
      packing.status_pt = statusTypePt.TRAVELING;
      packing.trip.date = new Date().getTime();

      await modelOperations.remove_alert(packing, alertsType.MISSING);
      await modelOperations.remove_alert(packing, alertsType.LATE);
      await historic.createTravelingStatus(packing);
      return packing;
    }

    // quando a embalagem entre no caso de AUSENTE a mesma atualiza apenas os dados referentes
    // ao tempo em que ela permanece nessa condição
    let timeTnterval = Math.floor(dateToday - packing.packing_missing.date);
    packing.packing_missing.time_countdown = timeTnterval;
    timeTnterval = Math.floor(dateToday - packing.trip.date);

    // melhorar essa condição aqui
    if (!isMissing(packing, timeTnterval)) {
      // verifica se realmente ele esta ausente
      if (isLate(packing, timeTnterval)) {
        // verifica se realmente ele esta atrasado
        packing.trip.time_exceeded = true;
        packing.trip.time_late = Math.floor(dateToday - packing.trip.date_late);
        // isso pode acontecer quando uma determinada embalagem passa de imediato para ausente
        // sem passar por late, então esse problema pode ser gerado
        packing.status = statusType.LATE;
        packing.status_pt = statusTypePt.LATE;
        if (packing.trip.date_late === 0) {
          packing.trip.date_late = new Date().getTime();
          packing.trip.time_late = 0;
          await historic.createLateStatus(packing);
        } else {
          await historic.updateLateStatus(packing);
        }

        await modelOperations.update_alert(packing, alertsType.LATE);

        // remove historico de ausente
        await historic.removeHistoric(packing, packing.packing_missing.date, historicType.MISSING);
      } else {
        // verifica se realmente ele esta atrasado
        packing.trip.time_exceeded = false;
        packing.trip.time_late = 0;
        packing.trip.date_late = 0;
      }
      await modelOperations.remove_alert(packing, alertsType.MISSING);
      packing = cleanObject.cleanMissing(packing);
      packing = cleanObject.cleanFlags(packing);

      packing.traveling = true;
      if (!packing.trip.time_exceeded) {
        packing.status = statusType.TRAVELING;
        packing.status_pt = statusTypePt.TRAVELING;
        // remove o historico de atrasado
        await historic.removeHistoric(packing, packing.trip.date_late, historicType.LATE);
        await historic.updateTravelingStatus(packing);
      }
    } else {
      await historic.updateMissingStatus(packing);
    }

    return packing;
  } catch (error) {
    debug(`Failed to evaluates traveling of packing : ${packing._id}`);
    throw new Error(error);
  }
};
