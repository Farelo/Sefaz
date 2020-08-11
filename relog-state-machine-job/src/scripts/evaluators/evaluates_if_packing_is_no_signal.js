// const moment = require('moment')

// COMMON
const STATES = require('../common/states')

// MODELS
const { CurrentStateHistory } = require('../../models/current_state_history.model')
const { Packing } = require('../../models/packings.model')
const factStateMachine = require('../../models/fact_state_machine.model')

module.exports = async (packing, companies) => {
    try {
        //console.log(`EMBALAGEM ESTÁ SEM SINAL`)
        //if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.SEM_SINAL.alert) return null
        if (packing.current_state && packing.current_state === STATES.SEM_SINAL.alert) return null

        const newCurrentStateHistory = new CurrentStateHistory({ packing: packing._id, type: STATES.SEM_SINAL.alert, device_data_id: packing.last_device_data ? packing.last_device_data._id : null  })
        await newCurrentStateHistory.save();
        
        await factStateMachine.generateNewFact('state', packing, null, newCurrentStateHistory);

        if(packing.absent == true){
            let actualOfflineWhileAbsentRegister = createOfflineWhileAbsentRegister(packing)

            await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.SEM_SINAL.key, offlineWhileAbsent: actualOfflineWhileAbsentRegister })

        } else{
            await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.SEM_SINAL.key })
        }
        
    } catch (error) { 
        throw new Error(error)
    }
}

const createOfflineWhileAbsentRegister = (packing) => {

    if(!packing.offlineWhileAbsent){
        packing.offlineWhileAbsent.push({
            start: new Date()
        })
        return packing.offlineWhileAbsent
    }

    packing.offlineWhileAbsent.push({
        start: new Date()
    })
    return packing.offlineWhileAbsent
}