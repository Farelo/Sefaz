const debug = require('debug')('job:evaluators:evaluates_traveling')
const model_operations = require('../common/model_operations')
const alerts_type = require('../common/alerts_type')

module.exports = async (packing) => {
    try {
        let date_today = new Date().getTime()
        let time_interval = Math.floor(date_today - packing.trip.date)
        const missing_routes = packing.routes.filter(route => {
            return time_interval > (route.time.max + route.time.to_be_late)
        })

        if (missing_routes.length > 0) {
            debug(`Packing is missing! ${packing._id}`)

            packing.problem = false
            packing.traveling = false
            packing.missing = true
            packing.packing_missing = {
                date: packing.packing_missing.date,
                time_countdown: time_interval
            }
            packing.trip = {
                time_exceeded: true,
                time_countdown: time_interval
            }

            await model_operations.update_alert(packing, alerts_type.MISSING)
            // historic.update_from_alert(packing, historic_types.MISSING, packing.packing_missing.date, packing.packing_missing.time_countdown)

            return packing
        } else {
            date_today = new Date().getTime()
            time_interval = Math.floor(date_today - packing.trip.date)
            const late_routes = packing.routes.filter(route => {
                return time_interval > route.time.max
            })

            if (late_routes.length > 0) {
                debug(`Packing is late! ${packing._id}`)

                packing.problem = false
                packing.traveling = false
                packing.missing = false
                packing.packing_missing = {
                    date: 0,
                    time_countdown: 0
                }
                packing.trip = {
                    time_exceeded: true,
                    time_countdown: time_interval
                }

                await model_operations.update_alert(packing, alerts_type.LATE)

                return packing
            } else {
                debug(`Packing is traveling! ${packing._id}`)
                packing.problem = false
                packing.traveling = true
                packing.missing = false
                packing.packing_missing = {
                    date: 0,
                    time_countdown: 0
                }
                packing.trip = {
                    time_exceeded: false,
                    time_countdown: time_interval
                }
                packing.permanence = {
                    amount_days: 0,
                    date: 0,
                    time_exceeded: false
                }


                await model_operations.remove_alert(packing, alerts_type.MISSING)
                await model_operations.remove_alert(packing, alerts_type.LATE)

                return packing
            }
        }
    } catch (error) {
        debug(`Failed to evaluates traveling of packing : ${packing._id}`)
        throw new Error(error)
    }
}
