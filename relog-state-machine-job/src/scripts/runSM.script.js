const moment = require("moment");

// COMMON
const STATES = require("./common/states");

// MODELS
const { Packing } = require("../models/packings.model");
const { CurrentStateHistory } = require("../models/current_state_history.model");

// EVALUATORS
const evaluatesIfPackingIsNoSignal = require("./evaluators/evaluates_if_packing_is_no_signal");
const evaluatesIfPackingIsOnAControlPoint = require("./evaluators/evaluates_if_packing_is_on_a_control_point");
const evaluatesIfPackingIsAbsent = require("./evaluators/evaluates_if_packing_is_absent");
const evaluatesIfPackingIsWithBatteryLow = require("./evaluators/evaluates_if_packing_is_with_battery_low");
const evaluatesIfPackingIsInIncorrectLocal = require("./evaluators/evaluates_if_packing_is_in_incorrect_local");
const evaluatesIfPackingIsWithPermanenceTimeExceeded = require("./evaluators/evaluates_if_packing_is_with_permanence_time_exceeded");
const evaluatesIfPackingIsTraveling = require("./evaluators/evaluates_if_packing_is_traveling");
const factStateMachine = require("../models/fact_state_machine.model");

module.exports = async (setting, packing, controlPoints) => {
   let next_state;
   let isNoSignal;
   let isAbsent;
   let currentControlPoint;
   let isIncorrectLocal;
   let isPermanenceTimeExceeded;

   //mLog(' ')
   //mLog('==============================')
   //mLog(packing.tag.code)

   try {
      /* Se a embalagem está sem registro da loka eu não faço nada */
      if (!packing.last_device_data) return null;

      let lastMessageDate =
         packing.last_message_signal == undefined ? packing.last_device_data.message_date : packing.last_message_signal;

      /* Avalia se a bateria está baixa */
      await evaluatesIfPackingIsWithBatteryLow(packing, setting);

      /* Se a embalagem está desativada */
      if (!packing.active) {
         /* Eu checo se a embalagem está com sinal */
         if (getDiffDateTodayInDays(lastMessageDate) < setting.no_signal_limit_in_days) {
            await Packing.findByIdAndUpdate(
               packing._id,
               { current_state: STATES.DESABILITADA_COM_SINAL.key },
               { new: true }
            );

            if (
               packing.last_current_state_history &&
               packing.last_current_state_history.type === STATES.DESABILITADA_COM_SINAL.alert
            )
               return null;

            const newCurrentStateHistory = new CurrentStateHistory({
               packing: packing._id,
               type: STATES.DESABILITADA_COM_SINAL.alert,
               device_data_id: packing.last_device_data ? packing.last_device_data._id : null,
            });

            await newCurrentStateHistory.save();

            try {
               await factStateMachine.generateNewFact("state", packing, null, newCurrentStateHistory);
            } catch (error) {
               console.log(error);
            }

            return null;
         } else {
            /* Embalagem sem sinal */
            if (getDiffDateTodayInDays(lastMessageDate) < setting.missing_sinal_limit_in_days) {
               await Packing.findByIdAndUpdate(
                  packing._id,
                  { current_state: STATES.DESABILITADA_SEM_SINAL.key },
                  { new: true }
               );

               if (
                  packing.last_current_state_history &&
                  packing.last_current_state_history.type === STATES.DESABILITADA_SEM_SINAL.alert
               )
                  return null;

               const newCurrentStateHistory = new CurrentStateHistory({
                  packing: packing._id,
                  type: STATES.DESABILITADA_SEM_SINAL.alert,
                  device_data_id: packing.last_device_data ? packing.last_device_data._id : null,
               });
               await newCurrentStateHistory.save();

               try {
                  await factStateMachine.generateNewFact("state", packing, null, newCurrentStateHistory);
               } catch (error) {
                  console.log(error);
               }
            } else {
               await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.PERDIDA.key }, { new: true });

               if (
                  packing.last_current_state_history &&
                  packing.last_current_state_history.type === STATES.PERDIDA.alert
               )
                  return null;

               const newCurrentStateHistory = new CurrentStateHistory({
                  packing: packing._id,
                  type: STATES.PERDIDA.alert,
                  device_data_id: packing.last_device_data ? packing.last_device_data._id : null,
               });
               await newCurrentStateHistory.save();

               try {
                  await factStateMachine.generateNewFact("state", packing, null, newCurrentStateHistory);
               } catch (error) {
                  console.log(error);
               }
            }
            return null;
         }
      }

      switch (packing.current_state) {
         case STATES.ANALISE.key:
            /* ******************************ANALISE******************************* */
            mLog("ANÁLISE");

            try {
               // /* Checa se a embalagem está sem sinal, se estiver sai do switch */
               if (getDiffDateTodayInDays(lastMessageDate) < setting.no_signal_limit_in_days) {
                  //mLog('Menor que a tolerância de sem sinal')

                  /* Retorna o ponto de controle que a embalagem se encontra atualmente */
                  currentControlPoint = await evaluatesIfPackingIsOnAControlPoint(packing, controlPoints, setting);

                  /* Checa se a embalagem está ausente. se estiver atualiza a embalagem */
                  packing = await evaluatesIfPackingIsAbsent(packing, controlPoints, currentControlPoint);

                  /* Caso ela esteja localizada em um ponto de controle */
                  if (currentControlPoint) {
                     /* Checa se a embalagem está em um local correto. se não estiver cria um alerta e atualiza a embalagem */
                     await evaluatesIfPackingIsInIncorrectLocal(packing, currentControlPoint);

                     /* Checa o tempo de permanência da embalagem no ponto de controle */
                     // if (setting.enable_gc16) await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint)
                     await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint);
                  } else {
                     if (packing.permanence_time_exceeded == true) {
                        await Packing.findByIdAndUpdate(
                           packing._id,
                           { permanence_time_exceeded: false },
                           { new: true }
                        );

                        // current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
                        // if (current_state_history) {
                        //     await current_state_history.remove()
                        // }
                     }

                     /* Embalagem está em viagem */
                     //mLog("EM VIAGEM")
                     await evaluatesIfPackingIsTraveling(packing, setting);
                  }
               } else {
                  /* Embalagem sem sinal */
                  //mLog('Avaliar sem sinal')
                  await evaluatesIfPackingIsNoSignal(packing, setting);
               }
            } catch (error) {
               console.log("ANALISE", error);
            }
            break;

         case STATES.DESABILITADA_COM_SINAL.key:
            /* ******************************DESABILITADA_COM_SINAL***************************** */
            mLog("DESABILITADA_COM_SINAL");
            if (packing.active) {
               try {
                  await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.ANALISE.key }, { new: true });

                  if (
                     packing.last_current_state_history &&
                     packing.last_current_state_history.type === STATES.ANALISE.alert
                  )
                     return null;
                  const newCurrentStateHistory = new CurrentStateHistory({
                     packing: packing._id,
                     type: STATES.ANALISE.alert,
                     device_data_id: packing.last_device_data ? packing.last_device_data._id : null,
                  });
                  await newCurrentStateHistory.save();

                  await factStateMachine.generateNewFact("state", packing, null, newCurrentStateHistory);
               } catch (error) {
                  console.log("DESABILITADA_COM_SINAL", error);
               }
            }
            break;

         case STATES.DESABILITADA_SEM_SINAL.key:
            /* ******************************DESABILITADA_SEM_SINAL***************************** */
            mLog("DESABILITADA_SEM_SINAL");
            if (packing.active) {
               try {
                  /* Eu checo se a embalagem está com sinal */
                  if (getDiffDateTodayInDays(lastMessageDate) < setting.no_signal_limit_in_days) {
                     await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.ANALISE.key }, { new: true });

                     if (
                        packing.last_current_state_history &&
                        packing.last_current_state_history.type === STATES.ANALISE.alert
                     )
                        return null;
                     const newCurrentStateHistory = new CurrentStateHistory({
                        packing: packing._id,
                        type: STATES.ANALISE.alert,
                        device_data_id: packing.last_device_data ? packing.last_device_data._id : null,
                     });

                     await newCurrentStateHistory.save();

                     await factStateMachine.generateNewFact("state", packing, null, newCurrentStateHistory);
                  }
               } catch (error) {
                  console.log("DESABILITADA_SEM_SINAL", error);
               }
            }
            break;

         case STATES.LOCAL_INCORRETO.key:
            try {
               /* ******************************LOCAL_INCORRETO***************************** */
               mLog("LOCAL_INCORRETO");

               // /* Checa se a embalagem está sem sinal, se estiver sai do switch */
               if (getDiffDateTodayInDays(lastMessageDate) < setting.no_signal_limit_in_days) {
                  /* Retorna o ponto de controle que a embalagem se encontra atualmente */
                  currentControlPoint = await evaluatesIfPackingIsOnAControlPoint(packing, controlPoints, setting);

                  /* Checa se a embalagem está ausente. se estiver atualiza a embalagem */
                  packing = await evaluatesIfPackingIsAbsent(packing, controlPoints, currentControlPoint);

                  /* Caso ela esteja localizada em um ponto de controle */
                  if (currentControlPoint) {
                     /* Checa se a embalagem está em um local correto. se não estiver cria um alerta e atualiza a embalagem */
                     await evaluatesIfPackingIsInIncorrectLocal(packing, currentControlPoint);

                     /* Checa o tempo de permanência da embalagem no ponto de controle */
                     // if (setting.enable_gc16) await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint)
                     await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint);
                  } else {
                     if (packing.permanence_time_exceeded == true) {
                        await Packing.findByIdAndUpdate(
                           packing._id,
                           { permanence_time_exceeded: false },
                           { new: true }
                        );

                        // current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
                        // if (current_state_history) {
                        //     await current_state_history.remove()
                        // }
                     }

                     /* Embalagem está em viagem */
                     //mLog("EM VIAGEM")
                     await evaluatesIfPackingIsTraveling(packing, setting);
                  }
               } else {
                  /* Embalagem sem sinal */
                  await evaluatesIfPackingIsNoSignal(packing, setting);
               }
            } catch (error) {
               console.log("DESABILITADA_SEM_SINAL", error);
            }
            break;

         case STATES.LOCAL_CORRETO.key:
            try {
               /* ******************************LOCAL_CORRETO***************************** */
               mLog("LOCAL_CORRETO");

               // /* Checa se a embalagem está sem sinal, se estiver sai do switch */
               if (getDiffDateTodayInDays(lastMessageDate) < setting.no_signal_limit_in_days) {
                  /* Retorna o ponto de controle que a embalagem se encontra atualmente */
                  currentControlPoint = await evaluatesIfPackingIsOnAControlPoint(packing, controlPoints, setting);
                  //mLog(currentControlPoint.name)

                  /* Checa se a embalagem está ausente. se estiver atualiza a embalagem */
                  packing = await evaluatesIfPackingIsAbsent(packing, controlPoints, currentControlPoint);

                  /* Caso ela esteja localizada em um ponto de controle */
                  if (currentControlPoint) {
                     /* Checa se a embalagem está em um local correto. se não estiver cria um alerta e atualiza a embalagem */
                     await evaluatesIfPackingIsInIncorrectLocal(packing, currentControlPoint);

                     /* Checa o tempo de permanência da embalagem no ponto de controle */
                     // if (setting.enable_gc16) await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint)
                     await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint);
                  } else {
                     /* Embalagem está em viagem */

                     if (packing.permanence_time_exceeded == true) {
                        await Packing.findByIdAndUpdate(
                           packing._id,
                           { permanence_time_exceeded: false },
                           { new: true }
                        );

                        // current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
                        // if (current_state_history) {
                        //     await current_state_history.remove()
                        // }
                     }

                     //mLog("EM VIAGEM")
                     await evaluatesIfPackingIsTraveling(packing, setting);
                  }
               } else {
                  /* Embalagem sem sinal */
                  await evaluatesIfPackingIsNoSignal(packing, setting);
               }
            } catch (error) {
               console.log("LOCAL_CORRETO", error);
            }
            break;

         case STATES.VIAGEM_PRAZO.key:
            try {
               /* ******************************VIAGEM_PRAZO***************************** */
               mLog("VIAGEM_PRAZO");

               // /* Checa se a embalagem está sem sinal, se estiver sai do switch */
               if (getDiffDateTodayInDays(lastMessageDate) < setting.no_signal_limit_in_days) {
                  /* Retorna o ponto de controle que a embalagem se encontra atualmente */
                  currentControlPoint = await evaluatesIfPackingIsOnAControlPoint(packing, controlPoints, setting);

                  /* Checa se a embalagem está ausente. se estiver atualiza a embalagem */
                  packing = await evaluatesIfPackingIsAbsent(packing, controlPoints, currentControlPoint);

                  /* Caso ela esteja localizada em um ponto de controle */
                  if (currentControlPoint) {
                     /* Checa se a embalagem está em um local correto. se não estiver cria um alerta e atualiza a embalagem */
                     await evaluatesIfPackingIsInIncorrectLocal(packing, currentControlPoint);

                     /* Checa o tempo de permanência da embalagem no ponto de controle */
                     // if (setting.enable_gc16) await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint)
                     await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint);
                  } else {
                     /* Embalagem está em viagem */

                     if (packing.permanence_time_exceeded == true) {
                        await Packing.findByIdAndUpdate(
                           packing._id,
                           { permanence_time_exceeded: false },
                           { new: true }
                        );

                        // current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
                        // if (current_state_history) {
                        //     await current_state_history.remove()
                        // }
                     }

                     //mLog("EM VIAGEM")
                     await evaluatesIfPackingIsTraveling(packing, setting);
                  }
               } else {
                  /* Embalagem sem sinal */
                  await evaluatesIfPackingIsNoSignal(packing, setting);
               }
            } catch (error) {
               console.log("VIAGEM_PRAZO", error);
            }
            break;

         case STATES.VIAGEM_ATRASADA.key:
            try {
               /* ******************************VIAGEM_ATRASADA***************************** */
               mLog("VIAGEM_ATRASADA");

               // /* Checa se a embalagem está sem sinal, se estiver sai do switch */
               if (getDiffDateTodayInDays(lastMessageDate) < setting.no_signal_limit_in_days) {
                  /* Retorna o ponto de controle que a embalagem se encontra atualmente */
                  currentControlPoint = await evaluatesIfPackingIsOnAControlPoint(packing, controlPoints, setting);

                  /* Checa se a embalagem está ausente. se estiver atualiza a embalagem */
                  packing = await evaluatesIfPackingIsAbsent(packing, controlPoints, currentControlPoint);

                  /* Caso ela esteja localizada em um ponto de controle */
                  if (currentControlPoint) {
                     /* Checa se a embalagem está em um local correto. se não estiver cria um alerta e atualiza a embalagem */
                     await evaluatesIfPackingIsInIncorrectLocal(packing, currentControlPoint);

                     /* Checa o tempo de permanência da embalagem no ponto de controle */
                     // if (setting.enable_gc16) await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint)
                     await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint);
                  } else {
                     /* Embalagem está em viagem */

                     if (packing.permanence_time_exceeded == true) {
                        await Packing.findByIdAndUpdate(
                           packing._id,
                           { permanence_time_exceeded: false },
                           { new: true }
                        );

                        // current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
                        // if (current_state_history) {
                        //     await current_state_history.remove()
                        // }
                     }

                     //mLog("EM VIAGEM")
                     await evaluatesIfPackingIsTraveling(packing, setting);
                  }
               } else {
                  /* Embalagem sem sinal */
                  await evaluatesIfPackingIsNoSignal(packing, setting);
               }
            } catch (error) {
               console.log("VIAGEM_ATRASADA", error);
            }
            break;

         case STATES.VIAGEM_PERDIDA.key:
            try {
               /* ******************************VIAGEM_PERDIDA***************************** */
               mLog("VIAGEM_PERDIDA");

               // /* Checa se a embalagem está sem sinal, se estiver sai do switch */
               if (getDiffDateTodayInDays(lastMessageDate) < setting.no_signal_limit_in_days) {
                  /* Retorna o ponto de controle que a embalagem se encontra atualmente */
                  currentControlPoint = await evaluatesIfPackingIsOnAControlPoint(packing, controlPoints, setting);

                  /* Checa se a embalagem está ausente. se estiver atualiza a embalagem */
                  packing = await evaluatesIfPackingIsAbsent(packing, controlPoints, currentControlPoint);

                  /* Caso ela esteja localizada em um ponto de controle */
                  if (currentControlPoint) {
                     /* Checa se a embalagem está em um local correto. se não estiver cria um alerta e atualiza a embalagem */
                     await evaluatesIfPackingIsInIncorrectLocal(packing, currentControlPoint);

                     /* Checa o tempo de permanência da embalagem no ponto de controle */
                     // if (setting.enable_gc16) await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint)
                     await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint);
                  } else {
                     /* Embalagem está em viagem */

                     if (packing.permanence_time_exceeded == true) {
                        await Packing.findByIdAndUpdate(
                           packing._id,
                           { permanence_time_exceeded: false },
                           { new: true }
                        );

                        // current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
                        // if (current_state_history) {
                        //     await current_state_history.remove()
                        // }
                     }

                     //mLog("EM VIAGEM")
                     await evaluatesIfPackingIsTraveling(packing, setting);
                  }
               } else {
                  /* Embalagem sem sinal */
                  await evaluatesIfPackingIsNoSignal(packing, setting);
               }
            } catch (error) {
               console.log("VIAGEM_PERDIDA", error);
            }
            break;

         case STATES.SEM_SINAL.key:
            try {
               /* ******************************SEM_SINAL***************************** */
               mLog("SEM_SINAL");

               /* Checa se a embalagem está ausente. se estiver atualiza a embalagem */
               //await evaluatesIfPackingIsAbsent(packing, controlPoints, currentControlPoint)

               //Executa apenas se o alerta de perdido está habilitado
               if (setting.enable_perdida) {
                  //mLog('PERDIDO HABILITADO')
                  if (getDiffDateTodayInDays(lastMessageDate) < setting.missing_sinal_limit_in_days) {
                     /* Checa se a embalagem está sem sinal, se estiver sai do switch */
                     if (getDiffDateTodayInDays(lastMessageDate) < setting.no_signal_limit_in_days) {
                        const newCurrentStateHistory = new CurrentStateHistory({
                           packing: packing._id,
                           type: STATES.SINAL.alert,
                           device_data_id: packing.last_device_data ? packing.last_device_data._id : null,
                        });
                        await newCurrentStateHistory.save();

                        try {
                           await factStateMachine.generateNewFact("state", packing, null, newCurrentStateHistory);
                        } catch (error) {
                           console.log(error);
                        }

                        let actualOfflineWhileAbsentRegister = updateOfflineWhileAbsentRegister(packing);

                        await Packing.findByIdAndUpdate(
                           packing._id,
                           { current_state: STATES.ANALISE.key, offlineWhileAbsent: actualOfflineWhileAbsentRegister },
                           { new: true }
                        );

                        if (
                           packing.last_current_state_history &&
                           packing.last_current_state_history.type === STATES.ANALISE.alert
                        )
                           return null;

                        const newCurrentStateHistory2 = new CurrentStateHistory({
                           packing: packing._id,
                           type: STATES.ANALISE.alert,
                           device_data_id: packing.last_device_data ? packing.last_device_data._id : null,
                        });
                        await newCurrentStateHistory2.save();

                        try {
                           await factStateMachine.generateNewFact("state", packing, null, newCurrentStateHistory2);
                        } catch (error) {
                           console.log(error);
                        }
                     }
                  } else {
                     await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.PERDIDA.key }, { new: true });

                     if (
                        packing.last_current_state_history &&
                        packing.last_current_state_history.type === STATES.PERDIDA.alert
                     )
                        return null;
                     const newCurrentStateHistory = new CurrentStateHistory({
                        packing: packing._id,
                        type: STATES.PERDIDA.alert,
                        device_data_id: packing.last_device_data ? packing.last_device_data._id : null,
                     });
                     await newCurrentStateHistory.save();

                     try {
                        await factStateMachine.generateNewFact("state", packing, null, newCurrentStateHistory);
                     } catch (error) {
                        console.log(error);
                     }
                  }

                  //Executa apenas se o alerta de perdido está desabilitado
                  //Mantém acumulado em sem sinal
               } else {
                  //mLog('PERDIDO NÃO HABILITADO')
                  /* Checa se a embalagem está sem sinal, se estiver sai do switch */
                  if (getDiffDateTodayInDays(lastMessageDate) < setting.no_signal_limit_in_days) {
                     const newCurrentStateHistory = new CurrentStateHistory({
                        packing: packing._id,
                        type: STATES.SINAL.alert,
                        device_data_id: packing.last_device_data ? packing.last_device_data._id : null,
                     });
                     await newCurrentStateHistory.save();

                     try {
                        await factStateMachine.generateNewFact("state", packing, null, newCurrentStateHistory);
                     } catch (error) {
                        console.log(error);
                     }

                     let actualOfflineWhileAbsentRegister = updateOfflineWhileAbsentRegister(packing);

                     await Packing.findByIdAndUpdate(
                        packing._id,
                        { current_state: STATES.ANALISE.key, offlineWhileAbsent: actualOfflineWhileAbsentRegister },
                        { new: true }
                     );

                     if (
                        packing.last_current_state_history &&
                        packing.last_current_state_history.type === STATES.ANALISE.alert
                     )
                        return null;

                     const newCurrentStateHistory2 = new CurrentStateHistory({
                        packing: packing._id,
                        type: STATES.ANALISE.alert,
                        device_data_id: packing.last_device_data ? packing.last_device_data._id : null,
                     });
                     await newCurrentStateHistory2.save();

                     try {
                        await factStateMachine.generateNewFact("state", packing, null, newCurrentStateHistory2);
                     } catch (error) {
                        console.log(error);
                     }
                  }
               }
            } catch (error) {
               console.log("SEM_SINAL", error);
            }
            break;

         case STATES.PERDIDA.key:
            try {
               /* ******************************PERDIDA***************************** */
               mLog("PERDIDA");

               if (setting.enable_perdida) {
                  //mLog('STATUS PERDIDA HABILITADO')
                  /* Checa se a embalagem está ausente. se estiver atualiza a embalagem */
                  //await evaluatesIfPackingIsAbsent(packing, controlPoints, currentControlPoint)

                  // /* Checa se a embalagem está sem sinal, se estiver sai do switch */
                  if (getDiffDateTodayInDays(lastMessageDate) < setting.missing_sinal_limit_in_days) {
                     const newCurrentStateHistory = new CurrentStateHistory({
                        packing: packing._id,
                        type: STATES.SINAL.alert,
                        device_data_id: packing.last_device_data ? packing.last_device_data._id : null,
                     });
                     await newCurrentStateHistory.save();

                     try {
                        await factStateMachine.generateNewFact("state", packing, null, newCurrentStateHistory);
                     } catch (error) {
                        console.log(error);
                     }

                     let actualOfflineWhileAbsentRegister = updateOfflineWhileAbsentRegister(packing);

                     await Packing.findByIdAndUpdate(
                        packing._id,
                        { current_state: STATES.ANALISE.key, offlineWhileAbsent: actualOfflineWhileAbsentRegister },
                        { new: true }
                     );

                     if (
                        packing.last_current_state_history &&
                        packing.last_current_state_history.type === STATES.ANALISE.alert
                     )
                        return null;

                     const newCurrentStateHistory2 = new CurrentStateHistory({
                        packing: packing._id,
                        type: STATES.ANALISE.alert,
                        device_data_id: packing.last_device_data ? packing.last_device_data._id : null,
                     });
                     await newCurrentStateHistory2.save();

                     try {
                        await factStateMachine.generateNewFact("state", packing, null, newCurrentStateHistory2);
                     } catch (error) {
                        console.log(error);
                     }
                  }
               } else {
                  //mLog('STATUS PERDIDA NÃO HABILITADO')
                  if (getDiffDateTodayInDays(lastMessageDate) < setting.missing_sinal_limit_in_days) {
                     const newCurrentStateHistory = new CurrentStateHistory({
                        packing: packing._id,
                        type: STATES.SINAL.alert,
                        device_data_id: packing.last_device_data ? packing.last_device_data._id : null,
                     });
                     await newCurrentStateHistory.save();

                     try {
                        await factStateMachine.generateNewFact("state", packing, null, newCurrentStateHistory);
                     } catch (error) {
                        console.log(error);
                     }
                  }

                  let actualOfflineWhileAbsentRegister = updateOfflineWhileAbsentRegister(packing);

                  await Packing.findByIdAndUpdate(
                     packing._id,
                     { current_state: STATES.ANALISE.key, offlineWhileAbsent: actualOfflineWhileAbsentRegister },
                     { new: true }
                  );

                  if (
                     packing.last_current_state_history &&
                     packing.last_current_state_history.type === STATES.ANALISE.alert
                  )
                     return null;
                  const newCurrentStateHistory = new CurrentStateHistory({
                     packing: packing._id,
                     type: STATES.ANALISE.alert,
                     device_data_id: packing.last_device_data ? packing.last_device_data._id : null,
                  });
                  await newCurrentStateHistory.save();

                  try {
                     await factStateMachine.generateNewFact("state", packing, null, newCurrentStateHistory);
                  } catch (error) {
                     console.log(error);
                  }
               }
            } catch (error) {
               console.log("PERDIDA", error);
            }

            break;
      }
   } catch (error) {
      throw new Error(error);
   }
};

const getDiffDateTodayInDays = (date) => {
   const today = moment();
   date = moment(date);

   const duration = moment.duration(today.diff(date));
   return duration.asDays();
};

let idAbleToLog = false;
const mLog = (mText) => {
   if (idAbleToLog) console.log(mText);
};

const updateOfflineWhileAbsentRegister = (packing) => {
   //if we need to end, but there is not not a begin, then create one
   if (!packing.offlineWhileAbsent) {
      packing.offlineWhileAbsent.push({
         start: new Date(),
         end: new Date(),
      });
      return packing.offlineWhileAbsent;
   }

   //if we need to end, but there is not a begin, then create one
   // if (packing.offlineWhileAbsent && packing.offlineWhileAbsent.length == 0) {
   //     console.log('if 2')
   //     packing.offlineWhileAbsent.push({
   //         start: new Date(),
   //         end: new Date()
   //     })
   //     return packing.offlineWhileAbsent
   // }

   //create an end date
   if (packing.offlineWhileAbsent && packing.offlineWhileAbsent.length > 0) {
      // console.log(packing.offlineWhileAbsent.length)
      // console.log(packing.offlineWhileAbsent)
      // console.log(packing.offlineWhileAbsent[packing.offlineWhileAbsent.length-1])
      // console.log(packing.offlineWhileAbsent[packing.offlineWhileAbsent.length - 1].end)
      if (packing.offlineWhileAbsent[packing.offlineWhileAbsent.length - 1].end == null) {
         packing.offlineWhileAbsent[packing.offlineWhileAbsent.length - 1].end = new Date();
         return packing.offlineWhileAbsent;
      }

      return packing.offlineWhileAbsent;
   }

   return [];
};

const clearOfflineWhileAbsentRegister = (packing) => {
   if (packing.offlineWhileAbsent) {
      packing.offlineWhileAbsent = [];
      return packing.offlineWhileAbsent;
   }
};
