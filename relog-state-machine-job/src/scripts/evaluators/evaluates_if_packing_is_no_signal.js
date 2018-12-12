// const moment = require('moment')

// COMMON
const STATES = require('../common/states')

// MODELS
const { CurrentStateHistory } = require('../../models/current_state_history.model')
const { Packing } = require('../../models/packings.model')

module.exports = async (packing) => {
    try {
        console.log(`EMBALAGEM ESTÁ SEM SINAL`)
        if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.SEM_SINAL.alert) return true
        
        const currentStateHistory = new CurrentStateHistory({ packing: packing._id, type: STATES.SEM_SINAL.alert })
        await currentStateHistory.save()

        await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.SEM_SINAL.key })
    } catch (error) {
        console.error(error)
        throw new Error(error)
    }
}

// const getDiffDateTodayInDays = (date) => {
//     const today = moment()
//     date = moment(date)

//     const duration = moment.duration(today.diff(date))
//     return duration.asDays()
// }