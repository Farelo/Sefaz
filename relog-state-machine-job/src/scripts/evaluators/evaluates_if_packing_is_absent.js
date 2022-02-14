// COMMON
const STATES = require("../common/states");
const moment = require("moment");


// MODELS
const { CurrentStateHistory } = require("../../models/current_state_history.model");
const { Rack } = require("../../models/racks.model");
const { Cicle } = require("../../models/cicles.model");

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

               try{
                  let Cicle = new Cicle ({
                    id_rack: rack,
                    cicle_start: Date.now(),
                    cicle_end: null,
                    total_cicle_duration: 0,
                    control_point_origin: controlPoints,
                    control_point_destiny: null,
                  });
                  await Cicle.save();
            
              } catch (error) {
                throw new Error(error);
              }
               await Rack.findByIdAndUpdate(
                  rack._id,
                  { absent: true, absent_time: new Date()},
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
               
               
               //if (rack.cicle_start) calculate = getDiffDateTodayInHours(rack.cicle_start);
                //rack.last_cicle_duration;
                
                var cicle_calculate = await Cicle.findByIdAndUpdate(
                  rack._id,
                  {
                     cicle_end: Date.now(),
                     control_point_destiny: controlPoints,  
                  },
                  { new: true }
               );

               let total_cicle_duration = total_cicle_duration + (cicle_calculate.cicle_start - cicle_calculate.cicle_end);
                total_cicle_duration = getDiffDateTodayInHours(total_cicle_duration);

                await Cicle.findByIdAndUpdate(
                  rack._id,
                  {
                     total_cicle_duration: total_cicle_duration,
                  },
                  { new: true }
               );
               await Rack.findByIdAndUpdate(
                  rack._id,
                  {
                     absent: false,
                     absent_time: null,
                     offlineWhileAbsent: [],
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
            try{
               let Cicle = new Cicle ({
                 id_rack: rack,
                 cicle_start: Date.now(),
                 cicle_end: null,
                 total_cicle_duration: 0,
                 control_point_origin: controlPoints,
                 control_point_destiny: null,
               });
               
      
               await Cicle.save();
         
           } catch (error) {
             throw new Error(error);
           }
            await Rack.findByIdAndUpdate(
               rack._id,
               { absent: true, absent_time: new Date() },
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
