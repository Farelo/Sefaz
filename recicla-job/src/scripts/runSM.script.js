// const moment = require('moment')

// COMMON
const STATES = require('./common/states')

// EVALUATORS
const evaluatesIfPackingIsNoSignal = require('./evaluators/evaluates_if_packing_is_no_signal');
const evaluatesIfPackingIsOnAControlPoint = require('./evaluators/evaluates_if_packing_is_on_a_control_point')
const evaluatesIfPackingIsAbsent = require('./evaluators/evaluates_if_packing_is_absent')
const evaluatesIfPackingIsInIncorrectLocal = require('./evaluators/evaluates_if_packing_is_in_incorrect_local')
const evaluatesIfPackingIsWithPermanenceTimeExceeded = require('./evaluators/evaluates_if_packing_is_with_permanence_time_exceeded')

module.exports = async (setting, packing, controlPoints) => {
    try {
        let isNoSignal
        let isAbsent
        let currentControlPoint
        let isIncorrectLocal
        let isPermanenceTimeExceeded

        /* Se a embalagem está desativada eu não faço nada */
        if (!packing.active) return null
        /* Se a embalagem está sem registro da loka eu não faço nada */
        if (!packing.last_device_data) return null

        switch (packing.current_state) {
            case STATES.ANALISE.key:
                /* ******************************ANALISE******************************* */
                console.log('EMBALAGEM EM ANÁLISE')

                /* Checa se a embalagem está sem sinal, se estiver sai do switch */
                isNoSignal = await evaluatesIfPackingIsNoSignal(packing, setting)
                if (isNoSignal) break

                /* Retorna o ponto de controle que a embalagem se encontra atualmente */
                currentControlPoint = await evaluatesIfPackingIsOnAControlPoint(packing, controlPoints, setting)

                /* Caso ela esteja localizada em um ponto de controle */
                if (currentControlPoint) {
                    /* Checa o tempo de permanência da embalagem no ponto de controle */
                    isPermanenceTimeExceeded = await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, setting)
                    /* Checa se a embalagem está ausente. se estiver cria um alerta */
                    isAbsent = await evaluatesIfPackingIsAbsent(packing, controlPoints, currentControlPoint)
                    if (isAbsent) console.log("FORA DA PLANTA DO OWNER")

                    /* Checa se a embalagem está em um local correto. se não estiver cria um alerta */
                    isIncorrectLocal = await evaluatesIfPackingIsInIncorrectLocal(packing, currentControlPoint)
                    if (isIncorrectLocal) break
                } else {
                    /* Embalagem está em viagem */
                }
                break
            case STATES.SEM_SINAL.key:
                /* ******************************SEM_SINAL***************************** */
                break
            case STATES.AUSENTE.key:
                console.log('ESTÁ FORA DE UMA PLANTA DONA')

                /* Retorna o ponto de controle que a embalagem se encontra atualmente */
                currentControlPoint = await evaluatesIfPackingIsOnAControlPoint(packing, controlPoints, setting)
                /* Caso ela esteja localizada em um ponto de controle */
                if (currentControlPoint) {
                    /* Checa se a embalagem está ausente. se estiver cria um alerta */
                    isAbsent = await evaluatesIfPackingIsAbsent(packing, controlPoints, currentControlPoint)
                    if (isAbsent) break
                    /* Checa se a embalagem está em um local correto. se não estiver cria um alerta */
                    isIncorrectLocal = await evaluatesIfPackingIsInIncorrectLocal(packing, currentControlPoint)
                    if (isIncorrectLocal) break

                } else {
                    /* Embalagem está em viagem */
                }

                break
            case STATES.LOCAL_INCORRETO.key:
                console.log('ESTÁ NO LOCAL INCORRETO')

                /* Retorna o ponto de controle que a embalagem se encontra atualmente */
                currentControlPoint = await evaluatesIfPackingIsOnAControlPoint(packing, controlPoints, setting)
                /* Caso ela esteja localizada em um ponto de controle */
                if (currentControlPoint) {
                    /* Checa o tempo de permanência da embalagem no ponto de controle */
                    isPermanenceTimeExceeded = await evaluatesIfPackingIsWithPermanenceTimeExceeded(packing, setting)

                    /* Checa se a embalagem está ausente. se estiver cria um alerta e sai do switch */
                    isAbsent = await evaluatesIfPackingIsAbsent(packing, controlPoints, currentControlPoint)
                    if (isAbsent) break
                    
                    /* Checa se a embalagem está em um local correto. se não estiver cria um alerta e sai do switch */
                    isIncorrectLocal = await evaluatesIfPackingIsInIncorrectLocal(packing, currentControlPoint)
                    if (isIncorrectLocal) break

                } else {
                    /* Embalagem está em viagem */
                }

                break
        }
    } catch (error) {
        console.error(error)
        throw new Error(error)
    }
}