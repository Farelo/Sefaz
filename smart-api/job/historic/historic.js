const historicType = require('../common/historic_type');
const schemas = require('../../api/schemas/require_schemas');
const debug = require('debug')('job:historic');
const historicMovement = require('./historicMovement');

async function updateIncontidaStatus(packing) {
  await schemas.historicPackings.update(
    {
      packing: packing._id,
      date: packing.incontida.date,
      status: historicType.INCONTIDA,
    },
    {
      date: packing.incontida.date,
      temperature: packing.temperature,
      permanence_time: packing.incontida.time,
      serial: packing.serial,
      supplier: packing.supplier,
      packing: packing._id,
      packing_code: packing.code,
    },
  );

  debug(`Historic incontida updated with success ${packing._id}`);
  await historicMovement.verifyMovementPacking(packing, historicType.INCONTIDA);
}

async function updateNormalStatus(packing) {
  await schemas.historicPackings.update(
    {
      packing: packing._id,
      date: packing.permanence.date,
      status: historicType.NORMAL,
    },
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
      status: historicType.NORMAL,
    },
  );

  debug(`Historic normal updated with success ${packing._id}`);
  await historicMovement.verifyMovementPacking(packing, historicType.NORMAL);
}

async function updatePermanenceStatus(packing) {
  await schemas.historicPackings.update(
    {
      packing: packing._id,
      date: packing.permanence.date,
      status: historicType.NORMAL,
    },
    {
      actual_gc16: packing.actual_gc16,
      department: packing.department,
      plant: packing.actual_plant,
      date: packing.permanence.date_exceeded,
      temperature: packing.temperature,
      permanence_time: packing.permanence.amount_days_exceeded,
      serial: packing.serial,
      supplier: packing.supplier,
      packing: packing._id,
      packing_code: packing.code,
      status: historicType.PERMANENCE_EXCEEDED,
    },
  );

  debug(`Historic Permanence updated with success ${packing._id}`);
  await historicMovement.verifyMovementPacking(packing, historicType.NORMAL);
}

async function updateIncorrectStatus(packing) {
  await schemas.historicPackings.update(
    {
      packing: packing._id,
      date: packing.permanence.date,
      status: historicType.INCORRECT_LOCAL,
    },
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
      status: historicType.INCORRECT_LOCAL,
    },
  );

  debug(`Historic Incorrect Local updated with success ${packing._id}`);
  await historicMovement.verifyMovementPacking(packing, historicType.INCORRECT_LOCAL);
}

async function updateMissingStatus(packing) {
  await schemas.historicPackings.update(
    {
      packing: packing._id,
      date: packing.packing_missing.date,
      status: historicType.MISSING,
    },
    {
      date: packing.packing_missing.date,
      temperature: packing.temperature,
      permanence_time: packing.packing_missing.time_countdown,
      serial: packing.serial,
      supplier: packing.supplier,
      packing: packing._id,
      packing_code: packing.code,
      status: historicType.MISSING,
    },
  );

  debug(`Historic missing updated with success ${packing._id}`);
  await historicMovement.verifyMovementPacking(packing, historicType.MISSING);
}

async function updateTravelingStatus(packing) {
  await schemas.historicPackings.update(
    {
      packing: packing._id,
      date: packing.trip.date,
      status: historicType.TRAVELING,
    },
    {
      date: packing.trip.date,
      temperature: packing.temperature,
      permanence_time: packing.trip.time_countdown,
      serial: packing.serial,
      supplier: packing.supplier,
      packing: packing._id,
      packing_code: packing.code,
      status: historicType.TRAVELING,
    },
  );

  debug(`Historic traveling updated with success ${packing._id}`);
  await historicMovement.verifyMovementPacking(packing, historicType.TRAVELING);
}

async function updateLateStatus(packing) {
  await schemas.historicPackings.update(
    {
      packing: packing._id,
      date: packing.trip.date_late,
      status: historicType.LATE,
    },
    {
      date: packing.trip.date_late,
      temperature: packing.temperature,
      permanence_time: packing.trip.time_late,
      serial: packing.serial,
      supplier: packing.supplier,
      packing: packing._id,
      packing_code: packing.code,
      status: historicType.LATE,
    },
  );

  debug(`Historic late updated with success ${packing._id}`);
  await historicMovement.verifyMovementPacking(packing, historicType.LATE);
}

async function createIncontidaStatus(packing) {
  const newHistoric = await new schemas.historicPackings({
    actual_gc16: packing.actual_gc16,
    date: packing.incontida.date,
    temperature: packing.temperature,
    permanence_time: packing.incontida.time,
    serial: packing.serial,
    supplier: packing.supplier,
    packing: packing._id,
    packing_code: packing.code,
    status: historicType.INCONTIDA,
  });
  await newHistoric.save();
  debug(`Historic incontida created with success ${packing._id}`);
  await historicMovement.verifyMovementPacking(packing, historicType.INCONTIDA);
}

async function createNormalStatus(packing) {
  const newHistoric = await new schemas.historicPackings({
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
    status: historicType.NORMAL,
  });
  await newHistoric.save();
  debug(`Historic normal created with success ${packing._id}`);
  await historicMovement.verifyMovementPacking(packing, historicType.NORMAL);
}

async function createPermanenceStatus(packing) {
  const newHistoric = await new schemas.historicPackings({
    actual_gc16: packing.actual_gc16,
    plant: packing.actual_plant,
    department: packing.department,
    date: packing.permanence.date_exceeded,
    temperature: packing.temperature,
    permanence_time: packing.permanence.amount_days_exceeded,
    serial: packing.serial,
    supplier: packing.supplier,
    packing: packing._id,
    packing_code: packing.code,
    status: historicType.PERMANENCE_EXCEEDED,
  });
  await newHistoric.save();
  debug(`Historic Permanence created with success ${packing._id}`);
  await historicMovement.verifyMovementPacking(packing, historicType.NORMAL);
}

async function createIncorrectStatus(packing) {
  const newHistoric = await new schemas.historicPackings({
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
    status: historicType.INCORRECT_LOCAL,
  });
  await newHistoric.save();
  debug(`Historic normal created with success ${packing._id}`);
  await historicMovement.verifyMovementPacking(packing, historicType.INCORRECT_LOCAL);
}

async function createMissingStatus(packing) {
  const newHistoric = await new schemas.historicPackings({
    actual_gc16: packing.actual_gc16,
    date: packing.packing_missing.date,
    temperature: packing.temperature,
    permanence_time: packing.packing_missing.time_countdown,
    serial: packing.serial,
    supplier: packing.supplier,
    packing: packing._id,
    packing_code: packing.code,
    status: historicType.MISSING,
  });
  await newHistoric.save();
  debug(`Historic missing created with success ${packing._id}`);
  await historicMovement.verifyMovementPacking(packing, historicType.MISSING);
}

async function createTravelingStatus(packing) {
  const newHistoric = await new schemas.historicPackings({
    actual_gc16: packing.actual_gc16,
    date: packing.trip.date,
    temperature: packing.temperature,
    permanence_time: packing.trip.time_countdown,
    serial: packing.serial,
    supplier: packing.supplier,
    packing: packing._id,
    packing_code: packing.code,
    status: historicType.TRAVELING,
  });
  await newHistoric.save();
  debug(`Historic traveling created with success ${packing._id}`);
  await historicMovement.verifyMovementPacking(packing, historicType.TRAVELING);
}

async function createLateStatus(packing) {
  const newHistoric = await new schemas.historicPackings({
    actual_gc16: packing.actual_gc16,
    date: packing.trip.date_late,
    temperature: packing.temperature,
    permanence_time: packing.trip.time_late,
    serial: packing.serial,
    supplier: packing.supplier,
    packing: packing._id,
    packing_code: packing.code,
    status: historicType.LATE,
  });
  await newHistoric.save();
  debug(`Historic late created with success ${packing._id}`);
  await historicMovement.verifyMovementPacking(packing, historicType.LATE);
}

async function initNormal(packing, oldPlant, currentPlant) {
  if (oldPlant && currentPlant) {
    if (oldPlant.equals(currentPlant._id)) {
      await updateNormalStatus(packing);
    } else {
      await createNormalStatus(packing);
    }
  } else {
    await createNormalStatus(packing);
  }
}

async function initIncorrectLocal(packing, oldPlant, currentPlant) {
  if (oldPlant && currentPlant) {
    if (oldPlant.equals(currentPlant._id)) {
      await updateIncorrectStatus(packing);
    } else {
      await createIncorrectStatus(packing);
    }
  } else {
    await createIncorrectStatus(packing);
  }
}

async function removeHistoric(packing, date, status) {
  await schemas.historicPackings.remove({
    packing_code: packing.code,
    serial: packing.serial,
    supplier: packing.supplier._id,
    packing: packing._id,
    status,
    date,
  });
}

module.exports = {
  updateIncontidaStatus,
  updateTravelingStatus,
  updateMissingStatus,
  updateLateStatus,
  createIncontidaStatus,
  createTravelingStatus,
  createMissingStatus,
  createLateStatus,
  initNormal,
  initIncorrectLocal,
  removeHistoric,
  updatePermanenceStatus,
  createPermanenceStatus,
};
