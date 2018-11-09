const moment = require('moment')

const STATES = require('../common/states')

const { Family } = require('../../models/families.model')
const { Packing } = require('../../models/packings.model')
const { AlertHistory } = require('../../models/alert_history.model')

module.exports = async (packing, setting) => {
    let routeMax
    let routeOvertime
    let traveling_time_overtime

    if (packing.family.routes.length > 0) {
        const family = await Family.findById(packing.family).populate('routes')

        routeMax = family.routes.reduce(getTravelingTimeMax)
        routeOvertime = family.routes.reduce(getTravelingTimeOvertime)
        traveling_time_overtime = routeOvertime.traveling_time.overtime + routeMax.traveling_time.max

        if (!packing.last_event_record) return null

        if (packing.last_event_record.type === 'outbound') {
            if (getDiffDateTodayInDays(packing.last_event_record.created_at) <= routeMax.traveling_time.max) {
                console.log('VIAGEM_PRAZO')
                await Packing.findOneAndUpdate({ _id: packing._id }, { current_state: STATES.VIAGEM_PRAZO.key }, { new: true })
            } else {
                if (getDiffDateTodayInDays(packing.last_event_record.created_at) > traveling_time_overtime) {
                    console.log('PERDIDA')

                    if (packing.last_alert_history && packing.last_alert_history.type === STATES.PERDIDA.alert) return null

                    await AlertHistory.create({ packing: packing._id, type: STATES.PERDIDA.alert })
                    await Packing.findOneAndUpdate({ _id: packing._id }, { current_state: STATES.PERDIDA.key }, { new: true })
                } else {
                    console.log('VIAGEM_ATRASADA')
    
                    if (packing.last_alert_history && packing.last_alert_history.type === STATES.VIAGEM_ATRASADA.alert) return null
    
                    await AlertHistory.create({ packing: packing._id, type: STATES.VIAGEM_ATRASADA.alert })
                    await Packing.findOneAndUpdate({ _id: packing._id }, { current_state: STATES.VIAGEM_ATRASADA.key }, { new: true })
                }
            }
        }
    }
}
// const getTravelingTimeMin = (count, route) => route.traveling_time.min > count.traveling_time.min ? count.traveling_time.min = route.traveling_time.min : count.traveling_time.min
const getTravelingTimeMax = (count, route) => route.traveling_time.max > count.traveling_time.max ? count = route : count
const getTravelingTimeOvertime = (count, route) => route.traveling_time.overtime > count.traveling_time.overtime ? count = route : count


const getDiffDateTodayInDays = (date) => {
    const today = moment()
    date = moment(date)

    const duration = moment.duration(today.diff(date))
    return duration.asDays()
}