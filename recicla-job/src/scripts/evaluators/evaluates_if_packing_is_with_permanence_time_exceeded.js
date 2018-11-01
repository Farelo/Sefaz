const moment = require('moment')

// COMMON
const STATES = require('../common/states')

// MODELS
const { AlertHistory } = require('../../models/alert_history.model')
const { Family } = require('../../models/families.model')
const { GC16 } = require('../../models/gc16.model')

module.exports = async (packing, setting) => {
    let timeIntervalInDays

    // if (packing.family.routes.length > 0) {
        if (packing.last_event_record.type === 'inbound') {
            timeIntervalInDays = getDiffDateTodayInDays(packing.last_event_record.created_at)
            const gc16 = await GC16.findById(packing.family.gc16)
            if (!gc16) return false

            if (timeIntervalInDays > gc16.stock.days) {
                console.log("ESTOU COM O TEMPO DE PERMANÊNCIA EXCEDIDO CARAI")
            }

            return true
        }
    // }

    return false
}

const getDiffDateTodayInDays = (date) => {
    const today = moment()
    date = moment(date)

    const duration = moment.duration(today.diff(date))
    return duration.asDays()
}