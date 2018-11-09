const moment = require('moment')

// COMMON
const STATES = require('../common/states')

// MODELS
const { AlertHistory } = require('../../models/alert_history.model')
const { Family } = require('../../models/families.model')
const { GC16 } = require('../../models/gc16.model')
const { Packing } = require('../../models/packings.model')

module.exports = async (packing) => {
    try {
        if (packing.last_event_record.type === 'inbound') {
            timeIntervalInDays = getDiffDateTodayInDays(packing.last_event_record.created_at)
            const gc16 = await GC16.findById(packing.family.gc16)
            if (!gc16) return null

            const family = await Family.findById(packing.family).populate('company')

            if (family.company.type === 'owner') {
                if (timeIntervalInDays > gc16.owner_stock.days) {
                    console.log("ESTOU COM O TEMPO DE PERMANÊNCIA EXCEDIDO")
                    await Packing.findByIdAndUpdate(packing._id, { permanence_time_exceeded: true }, { new: true })
                } else {
                    console.log("DENTRO DO TEMPO DE PERMANÊNCIA")
                    await Packing.findByIdAndUpdate(packing._id, { permanence_time_exceeded: false }, { new: true })
                }
            } else {
                if (timeIntervalInDays > gc16.client_stock.days) {
                    console.log("ESTOU COM O TEMPO DE PERMANÊNCIA EXCEDIDO")
                    await Packing.findByIdAndUpdate(packing._id, { permanence_time_exceeded: true }, { new: true })
                } else {
                    console.log("DENTRO DO TEMPO DE PERMANÊNCIA")
                    await Packing.findByIdAndUpdate(packing._id, { permanence_time_exceeded: false }, { new: true })
                }
            }
        }
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