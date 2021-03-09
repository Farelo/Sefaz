const moment = require("moment")
const _ = require("lodash")

// COMMON
const STATES = require('./common/states')

// MODELS
const { Packing } = require('../models/packings.model')
const { CurrentStateHistory } = require('../models/current_state_history.model')

// EVALUATORS
const evaluatesIfPackingIsNoSignal = require('./evaluators/evaluates_if_packing_is_no_signal');
const evaluatesIfPackingIsOnAControlPoint = require('./evaluators/evaluates_if_packing_is_on_a_control_point')
const evaluatesIfPackingIsAbsent = require('./evaluators/evaluates_if_packing_is_absent')
const evaluatesIfPackingIsWithBatteryLow = require('./evaluators/evaluates_if_packing_is_with_battery_low')
const evaluatesIfPackingIsInIncorrectLocal = require('./evaluators/evaluates_if_packing_is_in_incorrect_local')
const evaluatesIfPackingIsWithPermanenceTimeExceeded = require('./evaluators/evaluates_if_packing_is_with_permanence_time_exceeded')
const evaluatesIfPackingIsTraveling = require('./evaluators/evaluates_if_packing_is_traveling')
const evaluatesIfPackingIsWithButtonFalse = require('./evaluators/evaluates_if_packing_is_with_button_false')

const getLastMessage = (package) => {
    if(package.last_message_signal) return new Date(package.last_message_signal).valueOf()
    
    let lastPosition = package.last_position ? package.last_position.timestamp : 0;
    let lastBattery = package.last_battery ? package.last_battery.timestamp : 0;
    let lastTemperature = package.last_temperature ? package.last_temperature.timestamp : 0;
    let lastButton = package.last_detector_switch ? package.last_detector_switch.timestamp : 0;

    return _.max(lastPosition, lastBattery, lastTemperature, lastButton) * 1000;
}

module.exports = async (setting, packing, controlPoints) => {

    let currentControlPoint

    //mLog(' ')
    //mLog('==============================')
    //mLog(packing.tag.code)

    try {
        /* Se a embalagem está sem registro da loka eu não faço nada */
        if (!packing.last_position) return null

        let lastMessageDate = getLastMessage(packing); 

        /* Avalia se a bateria está baixa */
        await evaluatesIfPackingIsWithBatteryLow(packing, setting)

        /* Se a embalagem está desativada */
        if (!packing.active) {
            /* Eu checo se a embalagem está com sinal */
            if (getDiffDateTodayInDays(lastMessageDate) < setting.no_signal_limit_in_days) {
                await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.DESABILITADA_COM_SINAL.key }, { new: true })

                if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.DESABILITADA_COM_SINAL.alert) return null
                await CurrentStateHistory.create({ packing: packing._id, type: STATES.DESABILITADA_COM_SINAL.alert, device_data_id: null  })

                return null
            } else {
                /* Embalagem sem sinal */
                if (getDiffDateTodayInDays(lastMessageDate) < setting.missing_sinal_limit_in_days) {
                    await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.DESABILITADA_SEM_SINAL.key }, { new: true })

                    if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.DESABILITADA_SEM_SINAL.alert) return null
                    await CurrentStateHistory.create({ packing: packing._id, type: STATES.DESABILITADA_SEM_SINAL.alert, device_data_id: null  })
                } else {
                    await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.PERDIDA.key }, { new: true })

                    if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.PERDIDA.alert) return null
                    await CurrentStateHistory.create({ packing: packing._id, type: STATES.PERDIDA.alert, device_data_id: null  })
                }
                return null
            }
        }

        // BOTAO Alps
        await evaluatesIfPackingIsWithButtonFalse(packing);

        switch (packing.current_state) {
            case STATES.ANALISE.key:
                /* ******************************ANALISE******************************* */
                mLog('ANÁLISE')

                // /* Checa se a embalagem está sem sinal, se estiver sai do switch */
                if (getDiffDateTodayInDays(lastMessageDate) < setting.no_signal_limit_in_days) { 
                    // console.log('com sinal');
                    /* Retorna o ponto de controle que a embalagem se encontra atualmente */
                    currentControlPoint = await evaluatesIfPackingIsOnAControlPoint(packing, controlPoints, setting) 

                    /* Checa se a embalagem está ausente. se estiver atualiza a embalagem */
                    packing = await evaluatesIfPackingIsAbsent(packing, controlPoints, currentControlPoint)

                    /* Caso ela esteja localizada em um ponto de controle */
                    if (currentControlPoint) { 
                        // console.log('dentro de PC');
                        /* Checa se a embalagem está em um local correto. se não estiver cria um alerta e atualiza a embalagem */
                        await evaluatesIfPackingIsInIncorrectLocal(packing, currentControlPoint, setting, setting)

                        /* Checa o tempo de permanência da embalagem no ponto de controle */
                        // if (setting.enable_gc16) await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint)
                        await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint)

                    } else { 
                        // console.log('fora de PC');
                        if (packing.permanence_time_exceeded == true) {
                            await Packing.findByIdAndUpdate(packing._id, { permanence_time_exceeded: false }, { new: true })

                            // current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
                            // if (current_state_history) {
                            //     await current_state_history.remove()
                            // }
                        }

                        /* Embalagem está em viagem */
                        //mLog("EM VIAGEM")
                        await evaluatesIfPackingIsTraveling(packing, setting)

                    }
                } else { 
                    /* Embalagem sem sinal */
                    //mLog('Avaliar sem sinal')
                    await evaluatesIfPackingIsNoSignal(packing, setting)
                }

                break
            case STATES.DESABILITADA_COM_SINAL.key:
                /* ******************************DESABILITADA_COM_SINAL***************************** */
                mLog('DESABILITADA_COM_SINAL')
                if (packing.active) {
                    executeAnalysis(packing, controlPoints, setting);
                }
                break
            case STATES.DESABILITADA_SEM_SINAL.key:
                /* ******************************DESABILITADA_SEM_SINAL***************************** */
                mLog('DESABILITADA_SEM_SINAL')
                if (packing.active) {
                    /* Eu checo se a embalagem está com sinal */
                    if (getDiffDateTodayInDays(lastMessageDate) < setting.no_signal_limit_in_days) {
                        executeAnalysis(packing, controlPoints, setting);
                    }
                }
                break
            case STATES.LOCAL_INCORRETO.key:
                /* ******************************LOCAL_INCORRETO***************************** */
                mLog('LOCAL_INCORRETO')

                // /* Checa se a embalagem está sem sinal, se estiver sai do switch */
                if (getDiffDateTodayInDays(lastMessageDate) < setting.no_signal_limit_in_days) {

                    /* Retorna o ponto de controle que a embalagem se encontra atualmente */
                    currentControlPoint = await evaluatesIfPackingIsOnAControlPoint(packing, controlPoints, setting)

                    /* Checa se a embalagem está ausente. se estiver atualiza a embalagem */
                    packing = await evaluatesIfPackingIsAbsent(packing, controlPoints, currentControlPoint)

                    /* Caso ela esteja localizada em um ponto de controle */
                    if (currentControlPoint) {
                        /* Checa se a embalagem está em um local correto. se não estiver cria um alerta e atualiza a embalagem */
                        await evaluatesIfPackingIsInIncorrectLocal(packing, currentControlPoint, setting)

                        /* Checa o tempo de permanência da embalagem no ponto de controle */
                        // if (setting.enable_gc16) await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint)
                        await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint) 

                    } else {

                        if (packing.permanence_time_exceeded == true) {
                            await Packing.findByIdAndUpdate(packing._id, { permanence_time_exceeded: false }, { new: true })

                            // current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
                            // if (current_state_history) {
                            //     await current_state_history.remove()
                            // }
                        }

                        /* Embalagem está em viagem */
                        //mLog("EM VIAGEM")
                        await evaluatesIfPackingIsTraveling(packing, setting)

                    }
                } else {
                    /* Embalagem sem sinal */
                    await evaluatesIfPackingIsNoSignal(packing, setting)
                }
                break
            case STATES.LOCAL_CORRETO.key:
                /* ******************************LOCAL_CORRETO***************************** */
                mLog('LOCAL_CORRETO')

                // /* Checa se a embalagem está sem sinal, se estiver sai do switch */
                if (getDiffDateTodayInDays(lastMessageDate) < setting.no_signal_limit_in_days) {

                    /* Retorna o ponto de controle que a embalagem se encontra atualmente */
                    currentControlPoint = await evaluatesIfPackingIsOnAControlPoint(packing, controlPoints, setting)
                    //mLog(currentControlPoint.name)

                    /* Checa se a embalagem está ausente. se estiver atualiza a embalagem */
                    packing = await evaluatesIfPackingIsAbsent(packing, controlPoints, currentControlPoint)

                    /* Caso ela esteja localizada em um ponto de controle */
                    if (currentControlPoint) {

                        /* Checa se a embalagem está em um local correto. se não estiver cria um alerta e atualiza a embalagem */
                        await evaluatesIfPackingIsInIncorrectLocal(packing, currentControlPoint, setting)

                        /* Checa o tempo de permanência da embalagem no ponto de controle */
                        // if (setting.enable_gc16) await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint)
                        await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint)

                    } else {
                        /* Embalagem está em viagem */

                        if (packing.permanence_time_exceeded == true) {
                            await Packing.findByIdAndUpdate(packing._id, { permanence_time_exceeded: false }, { new: true })

                            // current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
                            // if (current_state_history) {
                            //     await current_state_history.remove()
                            // }
                        }

                        //mLog("EM VIAGEM")
                        await evaluatesIfPackingIsTraveling(packing, setting)

                    }
                } else {
                    /* Embalagem sem sinal */
                    await evaluatesIfPackingIsNoSignal(packing, setting)
                }
                break
            case STATES.VIAGEM_PRAZO.key:
                /* ******************************VIAGEM_PRAZO***************************** */
                // console.log('VIAGEM_PRAZO')

                // /* Checa se a embalagem está sem sinal, se estiver sai do switch */
                if (getDiffDateTodayInDays(lastMessageDate) < setting.no_signal_limit_in_days) {

                    /* Retorna o ponto de controle que a embalagem se encontra atualmente */
                    currentControlPoint = await evaluatesIfPackingIsOnAControlPoint(packing, controlPoints, setting)

                    /* Checa se a embalagem está ausente. se estiver atualiza a embalagem */
                    packing = await evaluatesIfPackingIsAbsent(packing, controlPoints, currentControlPoint)

                    /* Caso ela esteja localizada em um ponto de controle */
                    if (currentControlPoint) {
                        /* Checa se a embalagem está em um local correto. se não estiver cria um alerta e atualiza a embalagem */
                        await evaluatesIfPackingIsInIncorrectLocal(packing, currentControlPoint, setting)

                        /* Checa o tempo de permanência da embalagem no ponto de controle */
                        // if (setting.enable_gc16) await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint)
                        await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint)

                    } else {
                        /* Embalagem está em viagem */

                        if (packing.permanence_time_exceeded == true) {
                            await Packing.findByIdAndUpdate(packing._id, { permanence_time_exceeded: false }, { new: true })

                            // current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
                            // if (current_state_history) {
                            //     await current_state_history.remove()
                            // }
                        }

                        //mLog("EM VIAGEM")
                        await evaluatesIfPackingIsTraveling(packing, setting)

                    }
                } else {
                    /* Embalagem sem sinal */
                    await evaluatesIfPackingIsNoSignal(packing, setting)
                }
                break
            case STATES.VIAGEM_ATRASADA.key:
                /* ******************************VIAGEM_ATRASADA***************************** */
                mLog('VIAGEM_ATRASADA')

                // /* Checa se a embalagem está sem sinal, se estiver sai do switch */
                if (getDiffDateTodayInDays(lastMessageDate) < setting.no_signal_limit_in_days) {

                    /* Retorna o ponto de controle que a embalagem se encontra atualmente */
                    currentControlPoint = await evaluatesIfPackingIsOnAControlPoint(packing, controlPoints, setting)

                    /* Checa se a embalagem está ausente. se estiver atualiza a embalagem */
                    packing = await evaluatesIfPackingIsAbsent(packing, controlPoints, currentControlPoint)

                    /* Caso ela esteja localizada em um ponto de controle */
                    if (currentControlPoint) {
                        /* Checa se a embalagem está em um local correto. se não estiver cria um alerta e atualiza a embalagem */
                        await evaluatesIfPackingIsInIncorrectLocal(packing, currentControlPoint, setting)

                        /* Checa o tempo de permanência da embalagem no ponto de controle */
                        // if (setting.enable_gc16) await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint)
                        await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint)

                    } else {
                        /* Embalagem está em viagem */

                        if (packing.permanence_time_exceeded == true) {
                            await Packing.findByIdAndUpdate(packing._id, { permanence_time_exceeded: false }, { new: true })

                            // current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
                            // if (current_state_history) {
                            //     await current_state_history.remove()
                            // }
                        }

                        //mLog("EM VIAGEM")
                        await evaluatesIfPackingIsTraveling(packing, setting)

                    }
                } else {
                    /* Embalagem sem sinal */
                    await evaluatesIfPackingIsNoSignal(packing, setting)
                }
                break
            case STATES.VIAGEM_PERDIDA.key:
                /* ******************************VIAGEM_PERDIDA***************************** */
                mLog('VIAGEM_PERDIDA')

                // /* Checa se a embalagem está sem sinal, se estiver sai do switch */
                if (getDiffDateTodayInDays(lastMessageDate) < setting.no_signal_limit_in_days) {

                    /* Retorna o ponto de controle que a embalagem se encontra atualmente */
                    currentControlPoint = await evaluatesIfPackingIsOnAControlPoint(packing, controlPoints, setting)

                    /* Checa se a embalagem está ausente. se estiver atualiza a embalagem */
                    packing = await evaluatesIfPackingIsAbsent(packing, controlPoints, currentControlPoint)

                    /* Caso ela esteja localizada em um ponto de controle */
                    if (currentControlPoint) {
                        /* Checa se a embalagem está em um local correto. se não estiver cria um alerta e atualiza a embalagem */
                        await evaluatesIfPackingIsInIncorrectLocal(packing, currentControlPoint, setting)

                        /* Checa o tempo de permanência da embalagem no ponto de controle */
                        // if (setting.enable_gc16) await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint)
                        await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint)

                    } else {
                        /* Embalagem está em viagem */

                        if (packing.permanence_time_exceeded == true) {
                            await Packing.findByIdAndUpdate(packing._id, { permanence_time_exceeded: false }, { new: true })

                            // current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
                            // if (current_state_history) {
                            //     await current_state_history.remove()
                            // }
                        }

                        //mLog("EM VIAGEM")
                        await evaluatesIfPackingIsTraveling(packing, setting)

                    }
                } else {
                    /* Embalagem sem sinal */
                    await evaluatesIfPackingIsNoSignal(packing, setting)
                }
                break
            case STATES.SEM_SINAL.key:
                /* ******************************SEM_SINAL***************************** */
                mLog('SEM_SINAL')

                /* Checa se a embalagem está ausente. se estiver atualiza a embalagem */
                //await evaluatesIfPackingIsAbsent(packing, controlPoints, currentControlPoint)

                //Executa apenas se o alerta de perdido está habilitado
                if (setting.enable_perdida) {
                    //mLog('PERDIDO HABILITADO')
                    if (getDiffDateTodayInDays(lastMessageDate) < setting.missing_sinal_limit_in_days) {
                        /* Checa se a embalagem está sem sinal, se estiver sai do switch */
                        if (getDiffDateTodayInDays(lastMessageDate) < setting.no_signal_limit_in_days) {
                            await CurrentStateHistory.create({ packing: packing._id, type: STATES.SINAL.alert, device_data_id: null  })

                            let actualOfflineWhileAbsentRegister = updateOfflineWhileAbsentRegister(packing)
                            await Packing.findByIdAndUpdate(packing._id, { offlineWhileAbsent: actualOfflineWhileAbsentRegister }, { new: true })

                            executeAnalysis(packing, controlPoints, setting);
                        }
                    } else {
                        await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.PERDIDA.key }, { new: true })

                        if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.PERDIDA.alert) return null
                        await CurrentStateHistory.create({ packing: packing._id, type: STATES.PERDIDA.alert, device_data_id: null  })
                    }

                    //Executa apenas se o alerta de perdido está desabilitado
                    //Mantém acumulado em sem sinal
                } else {
                    //mLog('PERDIDO NÃO HABILITADO')
                    /* Checa se a embalagem está sem sinal, se estiver sai do switch */
                    if (getDiffDateTodayInDays(lastMessageDate) < setting.no_signal_limit_in_days) {
                        await CurrentStateHistory.create({ packing: packing._id, type: STATES.SINAL.alert, device_data_id: null  })

                        let actualOfflineWhileAbsentRegister = updateOfflineWhileAbsentRegister(packing)
                        await Packing.findByIdAndUpdate(packing._id, { offlineWhileAbsent: actualOfflineWhileAbsentRegister }, { new: true })

                        executeAnalysis(packing, controlPoints, setting);
                    }
                }

                break
            case STATES.PERDIDA.key:
                /* ******************************PERDIDA***************************** */
                mLog('PERDIDA')

                if (setting.enable_perdida) {
                    //mLog('STATUS PERDIDA HABILITADO')
                    /* Checa se a embalagem está ausente. se estiver atualiza a embalagem */
                    //await evaluatesIfPackingIsAbsent(packing, controlPoints, currentControlPoint)

                    // /* Checa se a embalagem está sem sinal, se estiver sai do switch */
                    if (getDiffDateTodayInDays(lastMessageDate) < setting.missing_sinal_limit_in_days) {
                        await CurrentStateHistory.create({ packing: packing._id, type: STATES.SINAL.alert, device_data_id: null  })

                        let actualOfflineWhileAbsentRegister = updateOfflineWhileAbsentRegister(packing)
                        await Packing.findByIdAndUpdate(packing._id, { offlineWhileAbsent: actualOfflineWhileAbsentRegister }, { new: true })

                        executeAnalysis(packing, controlPoints, setting);
                    }

                } else {
                    //mLog('STATUS PERDIDA NÃO HABILITADO')
                    if (getDiffDateTodayInDays(lastMessageDate) < setting.missing_sinal_limit_in_days) {
                        await CurrentStateHistory.create({ packing: packing._id, type: STATES.SINAL.alert, device_data_id: null  })
                    }

                    let actualOfflineWhileAbsentRegister = updateOfflineWhileAbsentRegister(packing)
                    await Packing.findByIdAndUpdate(packing._id, { offlineWhileAbsent: actualOfflineWhileAbsentRegister }, { new: true })

                    executeAnalysis(packing, controlPoints, setting);
                }

                break
        }

    } catch (error) {
        //console.error(error)
        throw new Error(error)
    }
}

const executeAnalysis = async (packing, controlPoints, setting) => {
    let lastMessageDate = getLastMessage(packing);

    // /* Checa se a embalagem está sem sinal, se estiver sai do switch */
    if (getDiffDateTodayInDays(lastMessageDate) < setting.no_signal_limit_in_days) {

        /* Retorna o ponto de controle que a embalagem se encontra atualmente */
        currentControlPoint = await evaluatesIfPackingIsOnAControlPoint(packing, controlPoints, setting)

        /* Checa se a embalagem está ausente. se estiver atualiza a embalagem */
        packing = await evaluatesIfPackingIsAbsent(packing, controlPoints, currentControlPoint)

        /* Caso ela esteja localizada em um ponto de controle */
        if (currentControlPoint) {
            /* Checa se a embalagem está em um local correto. se não estiver cria um alerta e atualiza a embalagem */
            await evaluatesIfPackingIsInIncorrectLocal(packing, currentControlPoint, setting, setting)

            /* Checa o tempo de permanência da embalagem no ponto de controle */
            // if (setting.enable_gc16) await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint)
            await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, currentControlPoint)

        } else {
            if (packing.permanence_time_exceeded == true) {
                await Packing.findByIdAndUpdate(packing._id, { permanence_time_exceeded: false }, { new: true })
            }

            /* Embalagem está em viagem */
            await evaluatesIfPackingIsTraveling(packing, setting)
        }
    } else {
        // console.log('Maior que a tolerância de sem sinal')
        await evaluatesIfPackingIsNoSignal(packing, setting)
    }
}

/**
 * Returns the time passed from a given timestamp
 * @param {*} timestampInMilliseconds The initial date we want to calculate de duration that has passed until now
 */
const getDiffDateTodayInDays = (timestampInMilliseconds) => {
    const today = moment()
    date = moment(timestampInMilliseconds)

    const duration = moment.duration(today.diff(timestampInMilliseconds))
    return duration.asDays()

    // let duration = moment(timestampInMilliseconds).fromNow();
    // return duration;
}

let idAbleToLog = false
const mLog = (mText) => {
    if (idAbleToLog) console.log(mText)
}

const updateOfflineWhileAbsentRegister = (packing) => {

    //if we need to end, but there is not not a begin, then create one
    if (!packing.offlineWhileAbsent) {
        packing.offlineWhileAbsent.push({
            start: new Date(),
            end: new Date()
        })
        return packing.offlineWhileAbsent
    }

    //create an end date
    if (packing.offlineWhileAbsent && packing.offlineWhileAbsent.length > 0) { 
        if (packing.offlineWhileAbsent[packing.offlineWhileAbsent.length - 1].end == null) {
            packing.offlineWhileAbsent[packing.offlineWhileAbsent.length - 1].end = new Date()
            return packing.offlineWhileAbsent
        }

        return packing.offlineWhileAbsent
    }

    return []
}

const clearOfflineWhileAbsentRegister = (packing) => {

    if (packing.offlineWhileAbsent) {
        packing.offlineWhileAbsent = []
        return packing.offlineWhileAbsent
    }
}