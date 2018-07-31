const debug = require('debug')('job:without route');

const evaluatesCurrentDepartment = require('../evaluators/evaluates_current_department');
const evaluatesPlantInformation = require('../evaluators/evaluates_plant_information');
const evaluatesCorrectLocation = require('../evaluators/evaluates_correct_location');
const modelOperations = require('../common/model_operations');
const cleanObject = require('../common/cleanObject');
const alertsType = require('../common/alerts_type');
const evaluatesTraveling = require('../evaluators/evaluates_traveling');
const evaluatesHistoric = require('../evaluators/evaluates_historic');

/**
 * Avalia o status da embalagem que apresenta rota.
 * Quando a mesma apresenta rota, varios alertas podem esta
 * associados a mesma, como Bateria, Local Incorreto, Permanencia e entre outros
 * podem explodir
 * @param {Object} packing
 * @param {Object} currentPlant
 */
async function evaluate(packing, currentPlant) {
  if (currentPlant != null) {
    // Avaliar sem tem departamento e o recupera
    const currentDepartment = await evaluatesCurrentDepartment(packing, currentPlant);
    // Coleta informações sobre a localização da embalagem
    packing = await evaluatesPlantInformation(packing, currentPlant, currentDepartment);

    // Está no local correto?
    const correctLocation = await evaluatesCorrectLocation(packing, currentPlant);

    if (correctLocation) {
      debug('Embalagem está no local correto');
      modelOperations.remove_alert(packing, alertsType.INCORRECT_LOCAL);
      // TODO: Trocar o packing.problem por packing.correct_location na collection
      packing = cleanObject.cleanFlags(packing); // limpa as flags
      packing = cleanObject.cleanMissing(packing); // limpa as informações sobre embalagem perdida
      packing = cleanObject.cleanTrip(packing); // limpa informações sobre a embalagem em viagem

      // Se estiver no local correto para de atualizar o trip.date da embalagem e o
      // actual_plant do banco
      // Adicionar ou atualizar a minha actual_plant da embalagem no banco
      // Adicionar ou atualizar a minha last_plant da embalagem no banco
      // Tempo de permanência (CEBRACE: em qualquer ponto de controle)
      await evaluatesHistoric(packing, currentPlant);
      await modelOperations.update_packing(packing);
    } else {
      debug('Embalagem está no local incorreto');

      // TODO: Trocar o packing.problem por packing.correct_location na collection
      packing = cleanObject.cleanFlags(packing); // limpa as flags
      packing = cleanObject.cleanMissing(packing); // limpa as informações sobre embalagem perdida
      packing = cleanObject.cleanTrip(packing); // limpa informações sobre a embalagem em viagem
      packing.problem = true;
      // packing = await evaluates_permanence_time.when_incorrect_location(packing)

      // Se estiver no local incorreto eu só atualizo o trip.date da embalagem e o actual_plant no banco
      // Tempo de permanência (CEBRACE: em qualquer ponto de controle)
      await modelOperations.remove_alert(packing, alertsType.PERMANENCE);
      await modelOperations.update_alert(packing, alertsType.INCORRECT_LOCAL);
      await evaluatesHistoric(packing, currentPlant);
      await modelOperations.update_packing(packing);
    }
  } else {
    // Está viajando
    debug(`Packing is traveling packing: ${packing._id}`);
    packing = await evaluatesTraveling(packing);

    await modelOperations.remove_alert(packing, alertsType.PERMANENCE);
    await modelOperations.remove_alert(packing, alertsType.INCORRECT_LOCAL);
    await modelOperations.update_packing_and_remove_actual_plant(packing);
    await evaluatesHistoric(packing, currentPlant);
    await modelOperations.update_packing(packing);
  }
}

module.exports = {
  evaluate,
};
