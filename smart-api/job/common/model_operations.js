const debug = require('debug')('job:common:model_operations');
const schemas = require('../../api/schemas/require_schemas');

module.exports.find_all_packings_plants_and_setting = async () => {
  try {
    const packings = await schemas.packing
      .find({})
      .populate('tag')
      .populate('actual_plant.plant')
      .populate('department')
      .populate('supplier')
      .populate('routes')
      .populate('project')
      .populate('gc16');
    const plants = await schemas.plant.find({}).populate('logistic_operator');
    const setting = await schemas.settings.findOne({ _id: 1 });

    const data = [packings, plants, setting];
    debug('All packings, plants and setting ok.');

    return data;
  } catch (error) {
    debug('Failed to gel all packings, plants and setting ok.');
    throw new Error(error);
  }
};

module.exports.update_devices = async (devices) => {
  try {
    const arrayOfPromises = [];

    devices.forEach(device => arrayOfPromises.push(schemas.packing.update({ code_tag: device.id }, device)));

    await Promise.all(arrayOfPromises);
    debug('Devices updated.');
  } catch (error) {
    debug('Failed to update devices in db.');
    throw new Error(error);
  }
};

/**
 * Tem a função de atualizar os dados recém inseridos na embna
 * @param {Object} packing Objeto seguindo o schema criado para embalagens
 */
module.exports.update_packing = async (packing) => {
  const options = { new: true };
  try {
    await schemas.packing.findByIdAndUpdate(packing._id, packing, options);
    debug(`Packing updated: ${packing._id}`);
  } catch (error) {
    debug('Failed to update packing in db.');
    throw new Error(error);
  }
};

/**
 * Atualiza ou cria alertas relacionadas a embalagem passada como parâmetro
 * e o tipo de alerta que será criado
 * @param {Object} packing
 * @param {Enum} alertType
 */
module.exports.update_alert = async (packing, alertType) => {
  try {
    const alert = await schemas.alert.find({
      packing: packing._id,
      status: alertType,
    });

    if (alert.length > 0) {
      await schemas.alert.update(
        { packing: packing._id, status: alertType },
        {
          department: packing.department,
          routes: packing.routes,
          project: packing.project,
          actual_plant: packing.actual_plant,
          supplier: packing.supplier,
          hashpacking: packing.hashPacking,
          serial: packing.serial,
        },
      );

      debug(`Alert updated from packing: ${packing._id}`);
    } else {
      const newAlert = new schemas.alert({
        actual_plant: packing.actual_plant,
        department: packing.department,
        packing: packing._id,
        routes: packing.routes,
        project: packing.project,
        supplier: packing.supplier,
        status: alertType,
        hashpacking: packing.hashPacking,
        serial: packing.serial,
        date: new Date().getTime(),
      });

      await newAlert.save();
      debug(`Alert created from packing: ${packing._id}`);
    }
  } catch (error) {
    debug('Failed to update alert in db.');
    throw new Error(error);
  }
};

/**
 * Remove os alertas passando a embalagem e o tipo de alerta
 * que se quer remover do sistema
 * @param {Object} packing
 * @param {Enum} alertType
 */
module.exports.remove_alert = async (packing, alertType) => {
  try {
    await schemas.alert.remove({
      packing: packing._id,
      status: alertType,
    });
    debug(`Alert removed from packing: ${packing._id}`);
  } catch (error) {
    debug('Failed to update alert in db.');
    throw new Error(error);
  }
};

/**
 * Cria o historico da embalagem, armazenando toda a trajetoria
 * da embalagem no sistema
 * @param {Object} packing
 */
module.exports.create_historic = async (packing, status) => {
  try {
    let newHistoric = null;
    if (packing.missing) {
      newHistoric = await new schemas.historicPackings({
        actual_gc16: packing.actual_gc16,
        date: packing.packing_missing.date,
        temperature: packing.temperature,
        permanence_time: packing.packing_missing.time_countdown,
        serial: packing.serial,
        supplier: packing.supplier,
        packing: packing._id,
        packing_code: packing.code,
        status,
      });
    } else {
      newHistoric = await new schemas.historicPackings({
        actual_gc16: packing.actual_gc16,
        plant: packing.actual_plant,
        department: packing.department,
        date: packing.permanence.date,
        temperature: packing.temperature,
        permanence_time: packing.permanence.amount_days,
        serial: packing.serial,
        supplier: packing.supplier,
        packing: packing._id,
        packing_code: packing.code,
        status,
      });
    }

    await newHistoric.save();
    debug(`Historic created with success ${packing._id}`);
  } catch (error) {
    debug('Failed to create a historic in db.');
    throw new Error(error);
  }
};

/**
 * Atualiza o historico da embalagem, armazenando toda a trajetoria
 * da embalagem no sistema
 * @param {Object} packing
 */
module.exports.update_historic = async (packing, status) => {
  try {
    if (packing.missing) {
      await schemas.historicPackings.update(
        {
          packing: packing._id,
          date: packing.packing_missing.date,
        },
        {
          date: packing.packing_missing.date,
          temperature: packing.temperature,
          permanence_time: packing.permanence.amount_days,
          serial: packing.serial,
          supplier: packing.supplier,
          packing: packing._id,
          packing_code: packing.code,
          status,
        },
      );
    } else {
      await schemas.historicPackings.update(
        { packing: packing._id, date: packing.permanence.date },
        {
          actual_gc16: packing.actual_gc16,
          department: packing.department,
          plant: packing.actual_plant,
          date: packing.permanence.date,
          temperature: packing.temperature,
          permanence_time: packing.permanence.amount_days,
          serial: packing.serial,
          supplier: packing.supplier,
          packing: packing._id,
          packing_code: packing.code,
          status,
        },
      );
    }

    debug(`Historic updated with success ${packing._id}`);
  } catch (error) {
    debug('Failed to create a historic in db.');
    throw new Error(error);
  }
};

/**
 * Tem a função de remover a planta atual e o departamento da planta se existir algum
 * relacionado a embalagem
 * @param {Object} packing Objeto seguindo o schema criado para embalagens
 */
module.exports.update_packing_and_remove_actual_plant = async (packing) => {
  try {
    await schemas.packing.update(
      { _id: packing._id },
      { $unset: { actual_plant: 1, department: 1 } },
    );
    debug('Remove Actual Plant .');
  } catch (error) {
    debug('Failed to update packing in db.');
    throw new Error(error);
  }
};
