// COMMON
const STATES = require("../common/states");
const moment = require("moment");

// MODELS
const { CurrentStateHistory } = require("../../models/current_state_history.model");
const { Rack } = require("../../models/racks.model");

module.exports = async (rack, controlPoints, currentControlPoint) => {
   try {
      if (currentControlPoint) {
         /* Recupera os pontos de controle que são owner */
         const controlPointOwner = controlPoints.filter(isOwnerOrSupplier);

         //console.log('filter isOwnerOrSupplier')
         //console.log(controlPointOwner)

         /* Checa se a embalagem está em algum ponto de controle OWNER */
         const rackIsOk = controlPointOwner.filter((cp) => isAbsent(cp, currentControlPoint));

         /* Se não estiver no ponto de controle OWNER atualiza a embalagem com o status ABSENT */
         // Se não iniciou, inicia o giro
         if (!rackIsOk.length) {
            if (!rack.absent_time) {
               await Rack.findByIdAndUpdate(
                  rack._id,
                  { absent: true, absent_time: new Date(), cicle_start: new Date(), cicle_end: null },
                  { new: true }
               );
            }

            // const current_state_history = await CurrentStateHistory.findOne({ rack: rack._id, type: STATES.AUSENTE.alert })
            // if (current_state_history) {
            //     //console.log("ESTADO DE AUSENTE JÁ CRIADO!")
            // } else {
            //     await CurrentStateHistory.create({ rack: rack._id, type: STATES.AUSENTE.alert, device_data_id: rack.last_device_data ? rack.last_device_data._id : null  })
            // }

            rack.absent = true;
            return rack;
         } else {
            // Finaliza o giro
            // console.log('ESTÁ NUMA PLANTA DONA')
            if (rack.absent_time) {
               let calculate = 0;
               if (rack.cicle_start) calculate = getDiffDateTodayInHours(rack.cicle_start);
               await Rack.findByIdAndUpdate(
                  rack._id,
                  {
                     absent: false,
                     absent_time: null,
                     offlineWhileAbsent: [],
                     cicle_end: new Date(),
                     last_cicle_duration: calculate,
                  },
                  { new: true }
               );
            }

            // let newRack = await Rack.findOne({_id: rack._id});
            // await Rack.findByIdAndUpdate(newRack._id, { last_owner_supplier: newRack.last_event_record });

            //console.log('ESTÁ NUMA PLANTA DONA')

            // current_state_history = await CurrentStateHistory.findOne({ rack: rack._id, type: STATES.AUSENTE.alert })
            // if (current_state_history) {
            //     await current_state_history.remove()
            // } else {
            //     //console.log("ESTADO DE AUSENTE JÁ REMOVIDO!")
            // }

            rack.absent = false;
            return rack;
         }
      } else {
         // console.log('ABSENT. FORA DE PLANTA')

         if (!rack.absent_time) {
            // console.log('NÃO ESTÁ NUMA PLANTA DONA.')
            // Inicia o giro
            await Rack.findByIdAndUpdate(
               rack._id,
               { absent: true, absent_time: new Date(), cicle_start: new Date(), cicle_end: null },
               { new: true }
            );
         }

         // const current_state_history = await CurrentStateHistory.findOne({ rack: rack._id, type: STATES.AUSENTE.alert })
         // if (current_state_history) {
         //     //console.log("ESTADO DE AUSENTE JÁ CRIADO!")
         // } else {
         //     await CurrentStateHistory.create({ rack: rack._id, type: STATES.AUSENTE.alert, device_data_id: rack.last_device_data ? rack.last_device_data._id : null  })
         // }

         rack.absent = true;
         return rack;
      }
   } catch (error) {
      console.error(error);
      throw new Error(error);
   }
};

const isOwnerOrSupplier = (value) => {
   return isOwner(value) || isSupplier(value);
};

const isOwner = (value) => {
   return value.company.type === "owner";
};

const isSupplier = (value) => {
   return value.company.type === "supplier";
};

const isAbsent = (value, currentControlPoint) => {
   return value._id.toString() === currentControlPoint._id.toString();
};

const getDiffDateTodayInHours = (date) => {
   const today = moment();
   date = moment(date);

   const duration = moment.duration(today.diff(date));
   return duration.asHours();
};
