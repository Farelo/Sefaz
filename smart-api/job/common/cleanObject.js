const debug = require('debug')('job:clean object');

/**
 * Limpa informações sobre a viagem
 * @param {Object} packing
 */
function cleanTrip(packing) {
  packing.trip = {
    time_exceeded: false,
    date: 0,
    time_countdown: 0,
    date_late: 0,
    time_late: 0,
  };
  return packing;
}
/**
 * Limpa informações sobre a viagem
 * @param {Object} packing
 */
function cleanIncontida(packing) {
  packing.incontida = {
    date: 0,
    time: 0,
    isIncontida: false,
  };
  return packing;
}
/**
 * Limpa informações sobre o tempo de permanencia da embalagem
 * @param {Object} packing
 */
function cleanPermanence(packing) {
  packing.permanence = {
    amount_days: 0,
    date: 0,
    time_exceeded: false,
    date_exceeded: 0,
    amount_days_exceeded: 0,
  };
  return packing;
}
/**
 * Limpa informações sobre a embalagem perdida
 * @param {Object} packing
 */
function cleanMissing(packing) {
  packing.packing_missing = {
    date: 0,
    time_countdown: 0,
  };
  return packing;
}
/**
 * Limpa informações sobre as flas do sistema
 * @param {Object} packing
 */
function cleanFlags(packing) {
  packing.problem = false;
  packing.missing = false;
  packing.traveling = false;
  return packing;
}

module.exports = {
  cleanTrip,
  cleanPermanence,
  cleanMissing,
  cleanFlags,
  cleanIncontida,
};