// COMMON
const STATES = require('../common/states')

// MODELS
const { AlertHistory } = require('../../models/alert_history.model')
const { Packing } = require('../../models/packings.model')

module.exports = async (packing, controlPoints, currentControlPoint) => {
    try {
        /* Checa se a embalagem tem rota */
        if (packing.family.routes.length > 0) {
            // console.log('TEM ROTA')
        } else {
            /* Recupera os pontos de controle que são owner */
            const controlPointOwner = controlPoints.filter(isOwner)
            /* Checa se a embalagem está em algum ponto de controle OWNER */
            const packingIsOk = controlPointOwner.filter(cp => isAbsent(cp, currentControlPoint))
            /* Se não estiver no ponto de controle OWNER atualiza a embalagem com o status ABSENT */
            if (!packingIsOk.length > 0) {
                // console.log('NÃO ESTÁ NUMA PLANTA DONA')
                if (packing.last_alert_history && packing.last_alert_history.type === STATES.AUSENTE.alert) return true

                const newAlertHistory = new AlertHistory({ packing: packing._id, type: STATES.AUSENTE.alert })
                newAlertHistory.save()
                // console.log('Embalagem atualizada absent:true ...')
                await Packing.findByIdAndUpdate(packing._id, { absent: true }, { new: true })
                return true
            } else {
                // console.log('Embalagem atualizada absent:false ...')
                await Packing.findByIdAndUpdate(packing._id, { absent: false }, { new: true })
            }
        }

        return false
    } catch (error) {
        console.error(error)
        throw new Error(error)
    }
}

const isOwner = (value) => {
    return value.company.type === 'owner'
}

const isAbsent = (value, currentControlPoint) => {
    return value._id.toString() === currentControlPoint._id.toString()
}