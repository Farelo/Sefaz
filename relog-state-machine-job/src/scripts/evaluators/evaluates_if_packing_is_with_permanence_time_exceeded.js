const moment = require("moment");

// COMMON
const STATES = require("../common/states");

// MODELS
const {
  CurrentStateHistory,
} = require("../../models/current_state_history.model");
const { Family } = require("../../models/families.model");
const { GC16 } = require("../../models/gc16.model");
const { Packing } = require("../../models/packings.model");
const factStateMachine = require('../../models/fact_state_machine.model')

module.exports = async (packing, currentControlPoint, companies) => {
  let current_state_history = {};
  try {
    if (
      packing.last_event_record &&
      packing.last_event_record.type === "inbound"
    ) {
      timeIntervalInDays = getDiffDateTodayInDays(
        packing.last_event_record.created_at
      );
      const gc16 = await GC16.findById(currentControlPoint.gc16);
      if (!gc16) return null;

      const family = await Family.findById(packing.family).populate("company");

      if (family.company.type === "owner") {
        if (timeIntervalInDays > gc16.owner_stock.days) {
          //console.log("ESTOU COM O TEMPO DE PERMANÊNCIA EXCEDIDO")
          if (packing.permanence_time_exceeded == false) {
            await Packing.findByIdAndUpdate(
              packing._id,
              { permanence_time_exceeded: true },
              { new: true }
            );

            const newCurrentStateHistory = new CurrentStateHistory({
              packing: packing._id,
              type: STATES.PERMANENCIA_EXCEDIDA.alert,
            });
            await newCurrentStateHistory.save();

            console.log("[generateNewFact] PERMANENCIA_EXCEDIDA @46");
            await factStateMachine.generateNewFact(
              packing,
              null,
              newCurrentStateHistory,
              companies
            );
          }

          // const current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
          // if (current_state_history) {
          //     //console.log("ESTADO DE TEMPO DE PERMANÊNCIA EXCEDIDO JÁ CRIADO!")
          // } else {
          //     await CurrentStateHistory.create({ packing: packing._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
          // }
        } else {
          //console.log("DENTRO DO TEMPO DE PERMANÊNCIA")
          if (packing.permanence_time_exceeded == true) {
            await Packing.findByIdAndUpdate(
              packing._id,
              { permanence_time_exceeded: true },
              { new: true }
            );

            // current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
            // if (current_state_history) {
            //     await current_state_history.remove()
            // } else {
            //     //console.log("ESTADO DE TEMPO DE PERMANÊNCIA EXCEDIDO JÁ REMOVIDO!")
            // }
          }
        }
      } else {
        if (timeIntervalInDays > gc16.client_stock.days) {
          if (packing.permanence_time_exceeded == false) {
            await Packing.findByIdAndUpdate(
              packing._id,
              { permanence_time_exceeded: true },
              { new: true }
            );

            const newCurrentStateHistory = new CurrentStateHistory({
              packing: packing._id,
              type: STATES.PERMANENCIA_EXCEDIDA.alert,
            });
            await newCurrentStateHistory.save();

            console.log("[generateNewFact] PERMANENCIA_EXCEDIDA @93");
            await factStateMachine.generateNewFact(
              packing,
              null,
              newCurrentStateHistory,
              companies
            );
          }
          //console.log("ESTOU COM O TEMPO DE PERMANÊNCIA EXCEDIDO")
          // await Packing.findByIdAndUpdate(packing._id, { permanence_time_exceeded: true }, { new: true })

          // const current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
          // if (current_state_history) {
          //     //console.log("ESTADO DE TEMPO DE PERMANÊNCIA EXCEDIDO JÁ CRIADO!")
          // } else {
          //     await CurrentStateHistory.create({ packing: packing._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
          // }
        } else {
          //console.log("DENTRO DO TEMPO DE PERMANÊNCIA")
          if (packing.permanence_time_exceeded == true) {
            await Packing.findByIdAndUpdate(
              packing._id,
              { permanence_time_exceeded: false },
              { new: true }
            );

            // current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
            // if (current_state_history) {
            //     await current_state_history.remove()
            // } else {
            //     //console.log("ESTADO DE TEMPO DE PERMANÊNCIA EXCEDIDO JÁ REMOVIDO!")
            // }
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const getDiffDateTodayInDays = (date) => {
  const today = moment();
  date = moment(date);

  const duration = moment.duration(today.diff(date));
  return duration.asDays();
};
