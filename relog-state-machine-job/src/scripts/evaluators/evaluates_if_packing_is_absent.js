// COMMON
const STATES = require('../common/states')
const moment = require('moment')

// MODELS
const { CurrentStateHistory } = require('../../models/current_state_history.model')
const { Packing } = require('../../models/packings.model')

module.exports = async (packing, controlPoints, currentControlPoint) => {
    try {
        if (currentControlPoint) {
            /* Recupera os pontos de controle que são owner */
            const controlPointOwner = controlPoints.filter(isOwnerOrSupplier)

            //console.log('filter isOwnerOrSupplier')
            //console.log(controlPointOwner)

            /* Checa se a embalagem está em algum ponto de controle OWNER */
            const packingIsOk = controlPointOwner.filter(cp => isAbsent(cp, currentControlPoint))

            /* Se não estiver no ponto de controle OWNER atualiza a embalagem com o status ABSENT */
            // Se não iniciou, inicia o giro
            if (!(packingIsOk.length > 0)) {
                console.log('NÃO ESTÁ NUMA PLANTA DONA')
                if (!packing.absent_time) await Packing.findByIdAndUpdate(packing._id, { absent: true, absent_time: new Date(), cicle_start: new Date(), cicle_end: null }, { new: true })

                const current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.AUSENTE.alert })
                if (current_state_history) {
                    //console.log("ESTADO DE AUSENTE JÁ CRIADO!") 
                } else {
                    await CurrentStateHistory.create({ packing: packing._id, type: STATES.AUSENTE.alert, device_data_id: packing.last_device_data ? packing.last_device_data._id : null  })
                }

                packing.absent = true
                return packing

            } else {
                // Finaliza o giro
                console.log('ESTÁ NUMA PLANTA DONA')
                if (packing.absent_time){
                    let calculate = 0
                    if(packing.cicle_start) calculate = getDiffDateTodayInHours(packing.cicle_start)
                    await Packing.findByIdAndUpdate(packing._id, { absent: false, absent_time: null, offlineWhileAbsent: [], cicle_end: new Date(), last_cicle_duration: calculate }, { new: true })
                } 
                //console.log('ESTÁ NUMA PLANTA DONA')

                current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.AUSENTE.alert })
                if (current_state_history) {
                    await current_state_history.remove()
                } else {
                    //console.log("ESTADO DE AUSENTE JÁ REMOVIDO!")
                }

                packing.absent = false
                return packing
            }

        } else {
            console.log('ABSENT. FORA DE PLANTA')

            if (!packing.absent_time) {
                console.log('NÃO ESTÁ NUMA PLANTA DONA.')
                // Inicia o giro
                await Packing.findByIdAndUpdate(packing._id, { absent: true, absent_time: new Date(), cicle_start: new Date(), cicle_end: null }, { new: true })
            }
            
            const current_state_history = await CurrentStateHistory.findOne({ packing: packing._id, type: STATES.AUSENTE.alert })
            if (current_state_history) {
                //console.log("ESTADO DE AUSENTE JÁ CRIADO!")
            } else {
                await CurrentStateHistory.create({ packing: packing._id, type: STATES.AUSENTE.alert, device_data_id: packing.last_device_data ? packing.last_device_data._id : null  })
            }

            packing.absent = true
            return packing
        }

    } catch (error) {
        console.error(error)
        throw new Error(error)
    }
}

const isOwnerOrSupplier = (value) => {
    return (isOwner(value) || isSupplier(value))
}

const isOwner = (value) => {
    return value.company.type === 'owner'
}

const isSupplier = (value) => {
    return value.company.type === 'supplier'
}

const isAbsent = (value, currentControlPoint) => {
    return value._id.toString() === currentControlPoint._id.toString()
}

const getDiffDateTodayInHours = (date) => {
    const today = moment()
    date = moment(date)

    const duration = moment.duration(today.diff(date))
    return duration.asHours()
}