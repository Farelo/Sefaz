// COMMON
const STATES = require('../common/states')

// MODELS
const { AlertHistory } = require('../../models/alert_history.model')

module.exports = (packing, currentControlPoint) => {
    try {
        /* Checa se a embalagem tem rota */
        if (packing.family.routes.length > 0) {
            // console.log('TEM ROTA')
        } else {
            /* Checa se a familia tem pontos de controle relacionada a ela */
            if (packing.family.control_points.length > 0) {
                // console.log('FAMILIA TEM PONTOS DE CONTROLE RELACIONADAS')
                /* Avalia se os pontos de controle da familia bate com o ponto de controle atual */
                const packingIsOk = packing.family.control_points.filter(cp => isIncorrectLocal(cp, currentControlPoint))
                // console.log(packingIsOk)
                /* Se não foi encontrado nenhum ponto de controle */
                if (!packingIsOk.length > 0) {
                    // console.log('EMBALAGEM ESTÁ EM UM LOCAL INCORRETO')
                    if (packing.last_alert_history && packing.last_alert_history.type === STATES.LOCAL_INCORRETO.alert) return true

                    const newAlertHistory = new AlertHistory({ packing: packing._id, type: STATES.LOCAL_INCORRETO.alert })
                    newAlertHistory.save()
                    return true
                } else {
                    // console.log('EMBALAGEM ESTÁ EM UM LOCAL CORRETO')
                }
            } 
        }

        return false
    } catch (error) {
        console.error(error)
        throw new Error(error)
    }
}

const isIncorrectLocal = (value, currentControlPoint) => {
    return value._id.toString() === currentControlPoint._id.toString()
}