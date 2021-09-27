const moment = require('moment')

// COMMON
const STATES = require('../common/states')

// MODELS
const { CurrentStateHistory } = require('../../models/current_state_history.model')
const { Family } = require('../../models/families.model')
const { GC16 } = require('../../models/gc16.model')
const { Rack } = require('../../models/racks.model')

module.exports = async (rack, currentControlPoint) => {
    let current_state_history = {}
    try {
        if (rack.last_event_record && rack.last_event_record.type === 'inbound') {
            timeIntervalInDays = getDiffDateTodayInDays(rack.last_event_record.created_at)
            const gc16 = await GC16.findById(currentControlPoint.gc16)
            if (!gc16) return null

            const family = await Family.findById(rack.family).populate('company')

            if (family.company.type === 'owner' || family.company.type === 'supplier') {
                if (timeIntervalInDays > gc16.owner_stock.days) {
                    //console.log("ESTOU COM O TEMPO DE PERMANÊNCIA EXCEDIDO")
                    await Rack.findByIdAndUpdate(rack._id, { permanence_time_exceeded: true }, { new: true })

                    const current_state_history = await CurrentStateHistory.findOne({ rack: rack._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
                    if (current_state_history) {
                        //console.log("ESTADO DE TEMPO DE PERMANÊNCIA EXCEDIDO JÁ CRIADO!")
                    } else {
                        await CurrentStateHistory.create({ rack: rack._id, type: STATES.PERMANENCIA_EXCEDIDA.alert, device_data_id: rack.last_position ? rack.last_position._id : null  })
                    }

                } else {
                    //console.log("DENTRO DO TEMPO DE PERMANÊNCIA")
                    await Rack.findByIdAndUpdate(rack._id, { permanence_time_exceeded: false }, { new: true })
                    
                    // current_state_history = await CurrentStateHistory.findOne({ rack: rack._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
                    // if (current_state_history) {
                    //     await current_state_history.remove()
                    // } else {
                    //     //console.log("ESTADO DE TEMPO DE PERMANÊNCIA EXCEDIDO JÁ REMOVIDO!")
                    // }
                }
            } else {
                if (timeIntervalInDays > gc16.client_stock.days) {
                    //console.log("ESTOU COM O TEMPO DE PERMANÊNCIA EXCEDIDO")
                    await Rack.findByIdAndUpdate(rack._id, { permanence_time_exceeded: true }, { new: true })
                    
                    const current_state_history = await CurrentStateHistory.findOne({ rack: rack._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
                    if (current_state_history) {
                        //console.log("ESTADO DE TEMPO DE PERMANÊNCIA EXCEDIDO JÁ CRIADO!")
                    } else {
                        await CurrentStateHistory.create({ rack: rack._id, type: STATES.PERMANENCIA_EXCEDIDA.alert, device_data_id: rack.last_position ? rack.last_position._id : null  })
                    }

                } else {
                    //console.log("DENTRO DO TEMPO DE PERMANÊNCIA")
                    await Rack.findByIdAndUpdate(rack._id, { permanence_time_exceeded: false }, { new: true })

                    // current_state_history = await CurrentStateHistory.findOne({ rack: rack._id, type: STATES.PERMANENCIA_EXCEDIDA.alert })
                    // if (current_state_history) {
                    //     await current_state_history.remove()
                    // } else {
                    //     //console.log("ESTADO DE TEMPO DE PERMANÊNCIA EXCEDIDO JÁ REMOVIDO!")
                    // }
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