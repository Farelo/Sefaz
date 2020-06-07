const moment = require('moment')

const STATES = require('../common/states')

const { Family } = require('../../models/families.model')
const { Packing } = require('../../models/packings.model')
const { CurrentStateHistory } = require('../../models/current_state_history.model')
const factStateMachine = require('../../models/fact_state_machine.model')

module.exports = async (packing, setting, companies) => {
    let routeMax
    let routeOvertime
    let traveling_time_overtime

    try { 
        //console.log('AVALIANDO VIAGEM')

        if (packing.family && packing.family.routes.length > 0) {
            //console.log('TEM ROTA')
            if (!packing.last_event_record) return null

            const family = await Family.findById(packing.family).populate('routes')

            routeMax = family.routes.reduce(getTravelingTimeMax)
            routeOvertime = family.routes.reduce(getTravelingTimeOvertime)
            traveling_time_overtime = routeOvertime.traveling_time.overtime + routeMax.traveling_time.max


            if (packing.last_event_record.type === 'outbound') {
                //console.log('FEZ OUTBOUNT')

                if (getDiffDateTodayInDays(packing.last_event_record.created_at) <= routeMax.traveling_time.max) {
                    //console.log('VIAGEM_PRAZO')
                    await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.VIAGEM_PRAZO.key }, { new: true })

                    if (packing.last_current_state_history && packing.last_current_state_history.type === 'viagem_em_prazo') {
                        //console.log("-")
                    } else {
                        const newCurrentStateHistory = new CurrentStateHistory({ packing: packing._id, type: 'viagem_em_prazo' });
                        await newCurrentStateHistory.save();
                        
                        console.log("[generateNewFact] viagem_em_prazo @42");
                        await factStateMachine.generateNewFact(packing, null, newCurrentStateHistory, companies);
                    }
                } else {
                    if (getDiffDateTodayInDays(packing.last_event_record.created_at) > traveling_time_overtime) {
                        //console.log('VIAGEM_VIAGEM_PERDIDA')
                        await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.VIAGEM_PERDIDA.key }, { new: true })

                        if (packing.last_current_state_history && packing.last_current_state_history.type === 'viagem_perdida') {
                            //console.log("-")
                        } else {
                            const newCurrentStateHistory = new CurrentStateHistory({ packing: packing._id, type: 'viagem_perdida' });
                            await newCurrentStateHistory.save();
                            
                            console.log("[generateNewFact] viagem_perdida @56");
                            await factStateMachine.generateNewFact(packing, null, newCurrentStateHistory, companies);
                        }

                    } else {
                        //console.log('VIAGEM_ATRASADA')
                        await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.VIAGEM_ATRASADA.key }, { new: true })

                        if (packing.last_current_state_history && packing.last_current_state_history.type === 'viagem_atrasada'.alert) {
                            //console.log("-")
                        } else { 
                            const newCurrentStateHistory = new CurrentStateHistory({ packing: packing._id, type: 'viagem_atrasada' });
                            await newCurrentStateHistory.save();
                            
                            console.log("[generateNewFact] viagem_atrasada @70");
                            await factStateMachine.generateNewFact(packing, null, newCurrentStateHistory, companies);
                        }

                    }
                }
            } else {
                //console.log('NÃO FEZ OUTBOUNT')
                /* Checa se a familia tem pontos de controle relacionada a ela */
                //console.log('FAMILIA TEM PONTOS DE CONTROLE RELACIONADAS')
                //console.log('IR PARA ANÁLISE')
                await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.ANALISE.key }, { new: true })

                if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.ANALISE.alert) return true
                
                const newCurrentStateHistory = new CurrentStateHistory({ packing: packing._id, type: STATES.ANALISE.alert });
                await newCurrentStateHistory.save();
                
                console.log("[generateNewFact] ANALISE @88");
                await factStateMachine.generateNewFact(packing, null, newCurrentStateHistory, companies);
            }
            
        //Emanoel
        } else{
            //console.log('VIAGEM_PRAZO')
            await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.VIAGEM_PRAZO.key }, { new: true })

            if (packing.last_current_state_history && packing.last_current_state_history.type === 'viagem_em_prazo') {
                //console.log("-")
            } else {
                //console.log("STATE HISTORY CRIADO")
                const newCurrentStateHistory = new CurrentStateHistory({ packing: packing._id, type: 'viagem_em_prazo' });
                await newCurrentStateHistory.save();
                
                console.log("[generateNewFact] viagem_em_prazo @104");
                await factStateMachine.generateNewFact(packing, null, newCurrentStateHistory, companies);
            }
        }
    } catch (error) {
        //console.error(error)
        throw new Error(error)
    }
}
// const getTravelingTimeMin = (count, route) => route.traveling_time.min > count.traveling_time.min ? count.traveling_time.min = route.traveling_time.min : count.traveling_time.min
const getTravelingTimeMax = (count, route) => route.traveling_time.max > count.traveling_time.max ? count = route : count
const getTravelingTimeOvertime = (count, route) => route.traveling_time.overtime > count.traveling_time.overtime ? count = route : count


const getDiffDateTodayInDays = (date) => {
    const today = moment()
    date = moment(date)

    const duration = moment.duration(today.diff(date))
    return duration.asHours()
}