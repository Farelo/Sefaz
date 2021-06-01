const moment = require("moment");

const STATES = require("../common/states");

const { Family } = require("../../models/families.model");
const { Rack } = require("../../models/racks.model");
const { CurrentStateHistory } = require("../../models/current_state_history.model");
const { EventRecord } = require("../../models/event_record.model");

module.exports = async (rack, setting) => {
   let routeMax;
   let routeOvertime;
   let traveling_time_overtime;

   try {
      if (rack.family && rack.family.routes.length > 0) {  

         const family = await Family.findById(rack.family).populate("routes");

         routeMax = family.routes.reduce(getTravelingTimeMax);
         routeOvertime = family.routes.reduce(getTravelingTimeOvertime);
         traveling_time_overtime = routeOvertime.traveling_time.overtime + routeMax.traveling_time.max;

         if (rack.last_event_record && rack.last_event_record.type === "outbound") {
            if (getDiffDateTodayInDays(rack.last_event_record.created_at) <= routeMax.traveling_time.max) {
               clearIncorrectLocalAttemptFlag(rack);
               await Rack.findByIdAndUpdate(rack._id, { current_state: STATES.VIAGEM_PRAZO.key }, { new: true });

               if (
                  rack.last_current_state_history &&
                  rack.last_current_state_history.type === "viagem_em_prazo") { 
               } else {
                  await CurrentStateHistory.create({
                     rack: rack._id,
                     type: "viagem_em_prazo",
                     device_data_id: rack.last_position ? rack.last_position._id : null,
                  });
               }
            } else {
               if (getDiffDateTodayInDays(rack.last_event_record.created_at) > traveling_time_overtime) { 
                  clearIncorrectLocalAttemptFlag(rack);

                  await Rack.findByIdAndUpdate(
                     rack._id,
                     { current_state: STATES.VIAGEM_PERDIDA.key },
                     { new: true }
                  );

                  if (
                     rack.last_current_state_history &&
                     rack.last_current_state_history.type === "viagem_perdida") {
                     //console.log("-")
                  } else {
                     await CurrentStateHistory.create({
                        rack: rack._id,
                        type: "viagem_perdida",
                        device_data_id: rack.last_position ? rack.last_position._id : null,
                     });
                  }
               } else { 
                  clearIncorrectLocalAttemptFlag(rack);

                  await Rack.findByIdAndUpdate(
                     rack._id,
                     { current_state: STATES.VIAGEM_ATRASADA.key },
                     { new: true }
                  );

                  if (
                     rack.last_current_state_history &&
                     rack.last_current_state_history.type === "viagem_atrasada".alert
                  ) {
                     //console.log("-")
                  } else {
                     await CurrentStateHistory.create({
                        rack: rack._id,
                        type: "viagem_atrasada",
                        device_data_id: rack.last_position ? rack.last_position._id : null,
                     });
                  }
               }
            }
         } 
          
         if (rack.last_event_record && rack.last_event_record.type === "inbound") { 
            createOutbound(rack); //Não se encontra em nenhum ponto de controle
            clearIncorrectLocalAttemptFlag(rack);

            await Rack.findByIdAndUpdate(rack._id, { current_state: STATES.VIAGEM_PRAZO.key }, { new: true });

            if (rack.last_current_state_history && rack.last_current_state_history.type === "viagem_em_prazo") {
               //console.log("-")
            } else {
               //console.log("STATE HISTORY CRIADO")
               await CurrentStateHistory.create({
                  rack: rack._id,
                  type: "viagem_em_prazo",
                  device_data_id: rack.last_position ? rack.last_position._id : null,
               });
            }
         }

         if (!rack.last_event_record) {
            clearIncorrectLocalAttemptFlag(rack);

            await Rack.findByIdAndUpdate(rack._id, { current_state: STATES.VIAGEM_PRAZO.key }, { new: true });

            if (rack.last_current_state_history && rack.last_current_state_history.type === "viagem_em_prazo") {
               //console.log("-")
            } else {
               //console.log("STATE HISTORY CRIADO")
               await CurrentStateHistory.create({
                  rack: rack._id,
                  type: "viagem_em_prazo",
                  device_data_id: rack.last_position ? rack.last_position._id : null,
               });
            }
         }

      } else {
         clearIncorrectLocalAttemptFlag(rack);
         await Rack.findByIdAndUpdate(rack._id, { current_state: STATES.VIAGEM_PRAZO.key }, { new: true });

         if (rack.last_current_state_history && rack.last_current_state_history.type === "viagem_em_prazo") {
            //console.log("-")
         } else {
            //console.log("STATE HISTORY CRIADO")
            await CurrentStateHistory.create({
               rack: rack._id,
               type: "viagem_em_prazo",
               device_data_id: rack.last_position ? rack.last_position._id : null,
            });
         }
      }
   } catch (error) {
      //console.error(error)
      throw new Error(error);
   }
};

const getLastPosition = (rack) => {
   if (rack.last_position) return rack.last_position;
   return null;
};

const createOutbound = async (rack) => {
   const eventRecord = new EventRecord({
      rack: rack._id,
      control_point: rack.last_event_record.control_point._id,
      distance_km: rack.last_event_record.distance_km,
      accuracy: getLastPosition(rack).accuracy,
      type: "outbound",
      device_data_id: getLastPosition(rack)._id,
   });
   await eventRecord.save();
};

const clearIncorrectLocalAttemptFlag = async (rack) => {
   if (rack.first_attempt_incorrect_local)
      await Rack.findByIdAndUpdate(rack._id, { first_attempt_incorrect_local: null }, { new: true });
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
