// COMMON
const STATES = require('../common/states')

// MODELS
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
                console.log('Embalagem atualizada absent:true ...')
                await Packing.findOneAndUpdate({ _id: packing._id }, { absent: true }, { new: true })
            } else {
                console.log('ESTÁ NUMA PLANTA DONA')
                console.log('Embalagem atualizada absent:false ...')
                await Packing.findOneAndUpdate({ _id: packing._id }, { absent: false }, { new: true })
            }
        } else {
            await Packing.findOneAndUpdate({ _id: packing._id }, { absent: true }, { new: true })
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