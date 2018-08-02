const debug = require('debug')('job:without route');
const evaluatesCurrentDepartment = require('../evaluators/evaluates_current_department');
const evaluatesPlantInformation = require('../evaluators/evaluates_plant_information');
const evaluatesPermanenceTime = require('../evaluators/evaluates_permanence_time');
const historic = require('../historic/historic');
const modelOperations = require('../common/model_operations');
const cleanObject = require('../common/cleanObject');
const alertsType = require('../common/alerts_type');
/**
 * Avalia informações sobre a embalagem que não apresenta rota.
 * Os Alertas que podem ser geradors nesse modulo são apenas o de PERMANÊNCIA.
 * Os demais alertas como LOCAL INCORRETO, LATE, AUSENTE podem ser discartados
 * ja que os mesmos dependem de informações das rotas
 * São avaliadas as condições sobre a mesma, ou seja, se esta em uma planta ou não.
 * A partir dessa definição é possivel inferir algumas alertas.
 * @param {Object} packing
 * @param {Object} currentPlant
 */
async function evaluate(packing, currentPlant) {
  const oldPlant = packing.actual_plant.plant;
  debug('Packing without route.');
  // Verifica se embalagem esta em alguma planta
  if (currentPlant != null) {
    // Quando uma embalagem esta em uma planta e a mesma não apresenta rotas, então
    // Apenas algumas alertas podem explodir, como tempo de permanencia (BASEADO NO GC16, SE O MESMO EXISTIR)
    // E tambem a questão da Bateria analisado previamente (O mesmo com perda de sinal)
    debug('Packing has plant.');
    // Avaliar sem tem departamento e o recupera
    const currentDepartment = await evaluatesCurrentDepartment(packing, currentPlant);
    packing = cleanObject.cleanFlags(packing); // limpa as flags
    packing = cleanObject.cleanMissing(packing); // limpa as informações sobre embalagem perdida
    packing = cleanObject.cleanTrip(packing); // limpa informações sobre a embalagem em viagem
    packing = cleanObject.cleanIncontida(packing); // limpa informações sobre a embalagem em viagem

    // Retorna informações sobre o tempo de permanencia da embalagem
    packing = await evaluatesPermanenceTime.evaluate(packing, currentPlant);
    // Coleta informações sobre a localização da embalagem
    packing = await evaluatesPlantInformation(packing, currentPlant, currentDepartment);

    await historic.initNormal(packing, oldPlant, currentPlant);
    await modelOperations.update_packing(packing);
  } else {
    // embalagem sem planta não há como inferir informações sobre
    // tempo de permanencia e outros alertas além do de bateria
    // que ja foi avaliado previamente (O mesmo com perda de sinal)
    debug('Packing without plant.');
    packing = cleanObject.cleanFlags(packing); // limpa as flags
    packing = cleanObject.cleanMissing(packing); // limpa as informações sobre embalagem perdida
    packing = cleanObject.cleanPermanence(packing); // limpa informações sobre o tempo de permanencia
    packing = cleanObject.cleanTrip(packing); // limpa informações sobre a embalagem em viagem
    await modelOperations.remove_alert(packing, alertsType.PERMANENCE);
    // remove informações sobre a planta atual, pois a mesma pode ter sido relacionada anteriormente a uma planta

    // quando a embalagem não esta associada a nenhuma rota e não esta em nnehuma planta é interessante saber
    // se a mesma ja  era vinculada a alguma planta , caso a mesma for é inserida informação sobre a ultima planta
    // em que foi vista
    packing.last_plant = packing.actual_plant;
    packing.last_department = packing.department;

    // atualiza informações sobre a mesma esta a primeira vez ou não incontida
    if (!packing.incontida.isIncontida) {
      packing.incontida = {
        date: new Date().getTime(),
        time: 0,
        isIncontida: true,
      };
      await historic.createIncontidaStatus(packing);
    } else {
      const timeInterval = new Date().getTime() - packing.incontida.date;
      packing.incontida.time = timeInterval;
      await historic.updateIncontidaStatus(packing);
    }

    await modelOperations.update_packing(packing);
    await modelOperations.update_packing_and_remove_actual_plant(packing);
  }

  await modelOperations.remove_alert(packing, alertsType.MISSING);
  await modelOperations.remove_alert(packing, alertsType.LATE);
  await modelOperations.remove_alert(packing, alertsType.INCORRECT_LOCAL);
  // Não existe a necessidade de remover informações de planta da embalagem mesmo a mesma não
  // apresentando rota, pois ela pode estar associada a alguma planta no sistema mesmo não
  // tendo rota
}

/**
 * Exporta o modulo que irá avaliar os status da embalagem quando a mesma
 * não apresenta rota e pode estar presente em uma planta ou não
 */
module.exports = {
  evaluate,
};
