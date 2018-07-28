const debug = require('debug')('job:evaluators:evaluates_permancence_time')
const model_operations = require('../common/model_operations')
const alerts_type = require('../common/alerts_type')

module.exports.when_correct_location = async (packing) => {

    let days_in_milliseconds = Infinity
    const date_today = new Date().getTime()
    const time_interval = Math.round(date_today - packing.permanence.date)

    if (packing.actual_gc16) days_in_milliseconds = 1000 * 60 * 60 * 24 * packing.actual_gc16.days // milliseconds*seconds*minutes*hours*days
    packing.permanence.amount_days = time_interval
    packing.permanence.date = date_today

    if (packing.permanence.amount_days > days_in_milliseconds) {
        debug(`Packing permanence exceeded. ${packing._id}`)
        packing.permanence.time_exceeded = true
        await model_operations.update_alert(packing, alerts_type.PERMANENCE)

        return packing
    } else {
        debug(`Packing permanence time ok. ${packing._id}`)
        packing.permanence.time_exceeded = false
        await model_operations.remove_alert(packing, alerts_type.PERMANENCE)
        
        return packing
    }
}

module.exports.when_incorrect_location = async (packing) => {
    debug(`Remove permanence time from packing in local incorrect.`)
    packing.permanence.time_exceeded = false
    packing.permanence.amount_days = 0
    packing.permanence.date = 0
    
    await model_operations.remove_alert(packing, alerts_type.PERMANENCE)

    return packing
}