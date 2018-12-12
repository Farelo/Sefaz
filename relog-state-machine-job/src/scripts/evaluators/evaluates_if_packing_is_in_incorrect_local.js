// COMMON
const STATES = require('../common/states')

// MODELS
const { CurrentStateHistory } = require('../../models/current_state_history.model')
const { Packing } = require('../../models/packings.model')
const { Family } = require('../../models/families.model')

module.exports = async (packing, currentControlPoint) => {
    try {
        /* Checa se a embalagem tem rota */
        if (packing.family.routes.length > 0) {
            console.log('TEM ROTA')

            const family = await Family.findById(packing.family)
                .populate('routes')
            
            const packingIsOk = family.routes.filter(route => isIncorrectLocalWithRoutes(route, currentControlPoint))
            if (!packingIsOk.length > 0) {
                console.log('EMBALAGEM ESTÁ EM UM LOCAL INCORRETO')
                if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.LOCAL_INCORRETO.alert) return true

                const newCurrentStateHistory = new CurrentStateHistory({ packing: packing._id, type: STATES.LOCAL_INCORRETO.alert })
                newCurrentStateHistory.save()

                await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.LOCAL_INCORRETO.key }, { new: true })
                return true
            } else {
                console.log('EMBALAGEM ESTÁ EM UM LOCAL CORRETO')
                await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.LOCAL_CORRETO.key }, { new: true })

                if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.LOCAL_CORRETO.alert) return true

                const newCurrentStateHistory = new CurrentStateHistory({ packing: packing._id, type: STATES.LOCAL_CORRETO.alert })
                newCurrentStateHistory.save()
            }

        } else {
            /* Checa se a familia tem pontos de controle relacionada a ela */
            if (packing.family.control_points.length > 0) {
                console.log('FAMILIA TEM PONTOS DE CONTROLE RELACIONADAS')
                /* Avalia se os pontos de controle da familia bate com o ponto de controle atual */
                const packingIsOk = packing.family.control_points.filter(cp => isIncorrectLocal(cp, currentControlPoint))
                /* Se não foi encontrado nenhum ponto de controle */
                if (!packingIsOk.length > 0) {
                    console.log('EMBALAGEM ESTÁ EM UM LOCAL INCORRETO')
                    if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.LOCAL_INCORRETO.alert) return true

                    const newCurrentStateHistory = new CurrentStateHistory({ packing: packing._id, type: STATES.LOCAL_INCORRETO.alert })
                    newCurrentStateHistory.save()

                    await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.LOCAL_INCORRETO.key }, { new: true })
                    return true
                } else {
                    console.log('EMBALAGEM ESTÁ EM UM LOCAL CORRETO')
                    await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.LOCAL_CORRETO.key }, { new: true })

                    if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.LOCAL_CORRETO.alert) return true

                    const newCurrentStateHistory = new CurrentStateHistory({ packing: packing._id, type: STATES.LOCAL_CORRETO.alert })
                    newCurrentStateHistory.save()
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
    return value.toString() === currentControlPoint._id.toString()
}

const isIncorrectLocalWithRoutes = (route, currentControlPoint) => {
    if (route.first_point.toString() === currentControlPoint._id.toString()) return route
    if (route.second_point.toString() === currentControlPoint._id.toString()) return route
    return null
}