const moment = require('moment')

// COMMON
const STATES = require('../common/states')

// MODELS
const { AlertHistory } = require('../../models/alert_history.model')
const { Packing } = require('../../models/packings.model')

module.exports = async (packing, setting) => {
    try {
        if (getDiffDateTodayInDays(packing.last_device_data.last_communication) > setting.no_signal_limit_in_days) {
            if (packing.last_alert_history && packing.last_alert_history.type === STATES.SEM_SINAL.alert) return true

            console.log(`EMBALAGEM ESTÁ SEM SINAL`)
            const alertHistory = new AlertHistory({ packing: packing._id, type: STATES.SEM_SINAL.alert })
            await alertHistory.save()

            await Packing.findOneAndUpdate({ _id: packing._id }, { current_state: STATES.SEM_SINAL.key })
            return true
        }
        
        return false
    } catch (error) {
        console.error(error)
        throw new Error(error)
    }
}

const getDiffDateTodayInDays = (date) => {
    const today = moment()
    date = moment(date)

    const duration = moment.duration(today.diff(date))
    return duration.asDays()
}