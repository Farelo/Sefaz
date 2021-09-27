// const moment = require('moment')

// COMMON
const STATES = require('../common/states')

// MODELS
const { CurrentStateHistory } = require('../../models/current_state_history.model')
const { Rack } = require('../../models/racks.model')

module.exports = async (rack) => {
    try {
        //console.log(`EMBALAGEM ESTÁ SEM SINAL`)
        //if (rack.last_current_state_history && rack.last_current_state_history.type === STATES.SEM_SINAL.alert) return null
        if (rack.current_state && rack.current_state === STATES.SEM_SINAL.alert) return null

        await CurrentStateHistory.create({ rack: rack._id, type: STATES.SEM_SINAL.alert, device_data_id: null  })
        // await currentStateHistory.save()

        // console.log('rack.absent')
        // console.log(rack.absent)

        if(rack.absent == true){
            let actualOfflineWhileAbsentRegister = createOfflineWhileAbsentRegister(rack)

            await Rack.findByIdAndUpdate(rack._id, { current_state: STATES.SEM_SINAL.key, offlineWhileAbsent: actualOfflineWhileAbsentRegister })

        } else{
            await Rack.findByIdAndUpdate(rack._id, { current_state: STATES.SEM_SINAL.key })
        }
        
    } catch (error) { 
        throw new Error(error)
    }
}

const createOfflineWhileAbsentRegister = (rack) => {

    if(!rack.offlineWhileAbsent){
        rack.offlineWhileAbsent.push({
            start: new Date()
        })
        return rack.offlineWhileAbsent
    }

    rack.offlineWhileAbsent.push({
        start: new Date()
    })
    return rack.offlineWhileAbsent
}