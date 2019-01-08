// COMMON
const STATES = require('../common/states')

// MODELS
const { CurrentStateHistory } = require('../../models/current_state_history.model')
const { Packing } = require('../../models/packings.model')

module.exports = async (packing, controlPoints, currentControlPoint) => {
    try {
        if (currentControlPoint) {
            /* Recupera os pontos de controle que são owner */
            const controlPointOwner = controlPoints.filter(isOwner)

            /* Checa se a embalagem está em algum ponto de controle OWNER */
            const packingIsOk = controlPointOwner.filter(cp => isAbsent(cp, currentControlPoint))

            /* Se não estiver no ponto de controle OWNER atualiza a embalagem com o status ABSENT */
            if (!packingIsOk.length > 0) {
                console.log('NÃO ESTÁ NUMA PLANTA DONA')
                if (!packing.absent_time) await Packing.findByIdAndUpdate(packing._id, { absent: true, absent_time: new Date() }, { new: true })

                const current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.AUSENTE.alert })
                if (current_state_history) {
                    console.log("ESTADO DE AUSENTE JÁ CRIADO!")
                } else {
                    await CurrentStateHistory.create({ packing: packing._id, type: STATES.AUSENTE.alert })
                }
            } else {
                console.log('ESTÁ NUMA PLANTA DONA')
                await Packing.findByIdAndUpdate(packing._id, { absent: false, absent_time: null }, { new: true })

                current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.AUSENTE.alert })
                if (current_state_history) {
                    await current_state_history.remove()
                } else {
                    console.log("ESTADO DE AUSENTE JÁ REMOVIDO!")
                }
            }
        } else {
            if (!packing.absent_time) await Packing.findByIdAndUpdate(packing._id, { absent: true, absent_time: new Date() }, { new: true })
            
            const current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.AUSENTE.alert })
            if (current_state_history) {
                console.log("ESTADO DE AUSENTE JÁ CRIADO!")
            } else {
                await CurrentStateHistory.create({ packing: packing._id, type: STATES.AUSENTE.alert })
            }
        }

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