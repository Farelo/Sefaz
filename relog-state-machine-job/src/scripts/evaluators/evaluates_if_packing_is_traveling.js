const moment = require("moment");

const STATES = require("../common/states");

const { Family } = require("../../models/families.model");
const { Packing } = require("../../models/packings.model");
const { CurrentStateHistory } = require("../../models/current_state_history.model");
const { EventRecord } = require("../../models/event_record.model");

module.exports = async (packing, setting) => {
   let routeMax;
   let routeOvertime;
   let traveling_time_overtime;

   try {
      console.log("AVALIANDO VIAGEM");

      if (packing.family && packing.family.routes.length > 0) {
         console.log("TEM ROTA");
         if (!packing.last_event_record) return null;

         const family = await Family.findById(packing.family).populate("routes");

         routeMax = family.routes.reduce(getTravelingTimeMax);
         routeOvertime = family.routes.reduce(getTravelingTimeOvertime);
         traveling_time_overtime = routeOvertime.traveling_time.overtime + routeMax.traveling_time.max;

         if (packing.last_event_record.type === "outbound") {
            //console.log('FEZ OUTBOUNT')

            if (getDiffDateTodayInDays(packing.last_event_record.created_at) <= routeMax.traveling_time.max) {
               //console.log('VIAGEM_PRAZO')
               clearIncorrectLocalAttemptFlag(packing);

               await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.VIAGEM_PRAZO.key }, { new: true });

               if (
                  packing.last_current_state_history &&
                  packing.last_current_state_history.type === "viagem_em_prazo"
               ) {
                  //console.log("-")
               } else {
                  await CurrentStateHistory.create({
                     packing: packing._id,
                     type: "viagem_em_prazo",
                     device_data_id: packing.last_position ? packing.last_position._id : null,
                  });
               }
            } else {
               if (getDiffDateTodayInDays(packing.last_event_record.created_at) > traveling_time_overtime) {
                  //console.log('VIAGEM_VIAGEM_PERDIDA')
                  clearIncorrectLocalAttemptFlag(packing);

                  await Packing.findByIdAndUpdate(
                     packing._id,
                     { current_state: STATES.VIAGEM_PERDIDA.key },
                     { new: true }
                  );

                  if (
                     packing.last_current_state_history &&
                     packing.last_current_state_history.type === "viagem_perdida"
                  ) {
                     //console.log("-")
                  } else {
                     await CurrentStateHistory.create({
                        packing: packing._id,
                        type: "viagem_perdida",
                        device_data_id: packing.last_position ? packing.last_position._id : null,
                     });
                  }
               } else {
                  //console.log('VIAGEM_ATRASADA')
                  clearIncorrectLocalAttemptFlag(packing);

                  await Packing.findByIdAndUpdate(
                     packing._id,
                     { current_state: STATES.VIAGEM_ATRASADA.key },
                     { new: true }
                  );

                  if (
                     packing.last_current_state_history &&
                     packing.last_current_state_history.type === "viagem_atrasada".alert
                  ) {
                     //console.log("-")
                  } else {
                     await CurrentStateHistory.create({
                        packing: packing._id,
                        type: "viagem_atrasada",
                        device_data_id: packing.last_position ? packing.last_position._id : null,
                     });
                  }
               }
            }
         } else {
            //console.log('NÃO FEZ OUTBOUNT')
            /* Checa se a familia tem pontos de controle relacionada a ela */
            //console.log('FAMILIA TEM PONTOS DE CONTROLE RELACIONADAS')
            //console.log('IR PARA ANÁLISE')
            console.log("cria outbound");
            createOutbound(packing); //Não se encontra em nenhum ponto de controle

            clearIncorrectLocalAttemptFlag(packing);

            await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.VIAGEM_PRAZO.key }, { new: true });

            if (packing.last_current_state_history && packing.last_current_state_history.type === "viagem_em_prazo") {
               //console.log("-")
            } else {
               //console.log("STATE HISTORY CRIADO")
               await CurrentStateHistory.create({
                  packing: packing._id,
                  type: "viagem_em_prazo",
                  device_data_id: packing.last_position ? packing.last_position._id : null,
               });
            }
         }

         //Emanoel
      } else {
         //console.log('VIAGEM_PRAZO')
         clearIncorrectLocalAttemptFlag(packing);

         await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.VIAGEM_PRAZO.key }, { new: true });

         if (packing.last_current_state_history && packing.last_current_state_history.type === "viagem_em_prazo") {
            //console.log("-")
         } else {
            //console.log("STATE HISTORY CRIADO")
            await CurrentStateHistory.create({
               packing: packing._id,
               type: "viagem_em_prazo",
               device_data_id: packing.last_position ? packing.last_position._id : null,
            });
         }
      }
   } catch (error) {
      //console.error(error)
      throw new Error(error);
   }
};

const getLastPosition = (packing) => {
   if (packing.last_position) return packing.last_position;
   return null;
};

const createOutbound = async (packing) => {
   const eventRecord = new EventRecord({
      packing: packing._id,
      control_point: packing.last_event_record.control_point._id,
      distance_km: packing.last_event_record.distance_km,
      accuracy: getLastPosition(packing).accuracy,
      type: "outbound",
      device_data_id: getLastPosition(packing)._id,
   });
   await eventRecord.save();
};

const clearIncorrectLocalAttemptFlag = async (packing) => {
   if (packing.first_attempt_incorrect_local)
      await Packing.findByIdAndUpdate(packing._id, { first_attempt_incorrect_local: null }, { new: true });
};

// const getTravelingTimeMin = (count, route) => route.traveling_time.min > count.traveling_time.min ? count.traveling_time.min = route.traveling_time.min : count.traveling_time.min
const getTravelingTimeMax = (count, route) =>
   route.traveling_time.max > count.traveling_time.max ? (count = route) : count;
const getTravelingTimeOvertime = (count, route) =>
   route.traveling_time.overtime > count.traveling_time.overtime ? (count = route) : count;

const getDiffDateTodayInDays = (date) => {
   const today = moment();
   date = moment(date);

   const duration = moment.duration(today.diff(date));
   return duration.asHours();
};
