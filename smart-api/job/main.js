const debug = require('debug')('job:main');
const cron = require('node-cron');

const tokenRequest = require('./loka_requests/token.request');
const devicesRequest = require('./loka_requests/devices.request');
const modelOperations = require('./common/model_operations');
const evaluatesBattery = require('./evaluators/evaluates_battery');
const evaluatesCurrentPlant = require('./evaluators/evaluates_current_plant');
const environment = require('../config/environment');
const withoutRoute = require('./state/withoutRoute');
const withRoute = require('./state/withRoute');

const statusAnalysis = async (data) => {
  const packings = data[0]; // Recupera todas as embalagens do banco
  const plants = data[1]; // Recupera todas plantas do banco
  const setting = data[2]; // Recupera o setting do banco
  // let total_packing = packings.length // Recupera a soma de pacotes no sistema
  // let count_packing = 0 // Contador das embalagens

  // packings.forEach(async (packing) => {
  for (const packing of packings) {
    // Avalia a bateria das embalagens
    await evaluatesBattery(packing, setting);
    // Embalagem perdeu sinal?

    // A verificação de um possivel local que a embalagem possa esta presenta
    // pode ser aplicada tambem para embalagens que não apresentam rotas
    // Está em alguma planta atualmente?
    const currentPlant = await evaluatesCurrentPlant(packing, plants, setting);

    if (packing.routes.length > 0) {
      // Tem rota?
      // Recupera a planta atual onde o pacote está atualmente
      withRoute.evaluate(packing, currentPlant);
    } else {
      // Qando não existe rota no sistema
      withoutRoute.evaluate(packing, currentPlant);
    }
  }
  // });
};

// O analysis_loop executa a cada X segundos uma rotina
const job = cron.schedule(`*/${environment.time} * * * * *`, async () => {
  try {
    const token = await tokenRequest(); // Recupera o token para acessar a API da LOKA
    const devicesArray = await devicesRequest(token); // Recupera todos os devices da API da LOKA
    await modelOperations.update_devices(devicesArray); // Atualiza todas as embalagens com os dados da API da LOKA
    const data = await modelOperations.find_all_packings_plants_and_setting(); // Recupera um array de todos as embalagens do banco depois de atualizados

    // Analisa o status de todas as embalagens
    await statusAnalysis(data);
  } catch (error) {
    debug('Something failed when startup the analysis_loop method.');
    debug(error);
    throw new Error(error);
  }
});

module.exports = job;
