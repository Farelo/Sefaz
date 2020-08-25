// COMMON
const STATES = require("../common/states");

// MODELS
const { CurrentStateHistory } = require("../../models/current_state_history.model");
const { Packing } = require("../../models/packings.model");
const { Family } = require("../../models/families.model");
const factStateMachine = require("../../models/fact_state_machine.model");

module.exports = async (packing, currentControlPoint) => {
    try {
        // if (packing.last_event_record) {
            /* Checa se a embalagem tem rota */
            // if (packing.family && packing.family.routes.length > 0) {
                //console.log('TEM ROTA')

                const family = await Family.findById(packing.family)

                const itsOnFamilyControlPoint = family.control_points.find(cp => isIncorrectLocalWithControlPoints(cp, currentControlPoint))
                if (itsOnFamilyControlPoint !== undefined) {
                    //console.log('EMBALAGEM ESTÁ EM UM LOCAL CORRETO')
                    await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.LOCAL_CORRETO.key }, { new: true })

                    if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.LOCAL_CORRETO.alert) return null
                    const newCurrentStateHistory = new CurrentStateHistory({ packing: packing._id, type: STATES.LOCAL_CORRETO.alert, device_data_id: packing.last_device_data ? packing.last_device_data._id : null  })
                    await newCurrentStateHistory.save();

                    // console.log("[generateNewFact] LOCAL_INCORRETO");
                    await factStateMachine.generateNewFact('state', packing, null, newCurrentStateHistory);
                } else {
                    //console.log('EMBALAGEM ESTÁ EM UM LOCAL INCORRETO')
                    await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.LOCAL_INCORRETO.key }, { new: true })

                    if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.LOCAL_INCORRETO.alert) return null
                    const newCurrentStateHistory = new CurrentStateHistory({ packing: packing._id, type: STATES.LOCAL_INCORRETO.alert, device_data_id: packing.last_device_data ? packing.last_device_data._id : null  })
                    await newCurrentStateHistory.save();

                    await factStateMachine.generateNewFact('state', packing, null, newCurrentStateHistory);
                }
                
                // const family = await Family.findById(packing.family)
                //     .populate('routes')

                // const packingIsOk = family.routes.filter(route => isIncorrectLocalWithRoutes(route, currentControlPoint))
                // if (!packingIsOk.length > 0) {
                //     //console.log('EMBALAGEM ESTÁ EM UM LOCAL INCORRETO')
                //     await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.LOCAL_INCORRETO.key }, { new: true })

                //     if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.LOCAL_INCORRETO.alert) return null
                //     await CurrentStateHistory.create({ packing: packing._id, type: STATES.LOCAL_INCORRETO.alert, device_data_id: packing.last_device_data ? packing.last_device_data._id : null  })
                // } else {
                //     //console.log('EMBALAGEM ESTÁ EM UM LOCAL CORRETO')
                //     await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.LOCAL_CORRETO.key }, { new: true })

                //     if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.LOCAL_CORRETO.alert) return null
                //     await CurrentStateHistory.create({ packing: packing._id, type: STATES.LOCAL_CORRETO.alert, device_data_id: packing.last_device_data ? packing.last_device_data._id : null  })
                // }

            // } else {
                /* Checa se a familia tem pontos de controle relacionada a ela */
                //console.log('FAMILIA TEM PONTOS DE CONTROLE RELACIONADAS')
                // await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.LOCAL_CORRETO.key }, { new: true })

                // if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.LOCAL_CORRETO.alert) return true
                // await CurrentStateHistory.create({ packing: packing._id, type: STATES.LOCAL_CORRETO.alert, device_data_id: packing.last_device_data ? packing.last_device_data._id : null  })

                // if (packing.family && packing.family.control_points.length > 0) {
                // /* Avalia se os pontos de controle da familia bate com o ponto de controle atual */
                // const packingIsOk = packing.family.control_points.filter(cp => isIncorrectLocal(cp, currentControlPoint))
                // /* Se não foi encontrado nenhum ponto de controle */
                // if (!packingIsOk.length > 0) {
                ////     console.log('EMBALAGEM ESTÁ EM UM LOCAL INCORRETO')
                //     await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.LOCAL_INCORRETO.key }, { new: true })

                //     if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.LOCAL_INCORRETO.alert) return true
                //     await CurrentStateHistory.create({ packing: packing._id, type: STATES.LOCAL_INCORRETO.alert, device_data_id: packing.last_device_data ? packing.last_device_data._id : null  })

                // } else {
                ////     console.log('EMBALAGEM ESTÁ EM UM LOCAL CORRETO')
                //     await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.LOCAL_CORRETO.key }, { new: true })

                //     if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.LOCAL_CORRETO.alert) return null
                //     await CurrentStateHistory.create({ packing: packing._id, type: STATES.LOCAL_CORRETO.alert, device_data_id: packing.last_device_data ? packing.last_device_data._id : null  })
                // }
                // } 
            // }
        // } else {
        //     /* Checa se a familia tem pontos de controle relacionada a ela */
        //     await Packing.findByIdAndUpdate(packing._id, { current_state: STATES.ANALISE.key }, { new: true })

        //     if (packing.last_current_state_history && packing.last_current_state_history.type === STATES.ANALISE.alert) return true
        //     await CurrentStateHistory.create({ packing: packing._id, type: STATES.ANALISE.alert, device_data_id: packing.last_device_data ? packing.last_device_data._id : null  })
        // }

    } catch (error) {
        console.error(error)
        throw new Error(error)
    }
}

const isIncorrectLocal = (value, currentControlPoint) => {
   return value.toString() === currentControlPoint._id.toString();
};

const isIncorrectLocalWithControlPoints = (cp, currentControlPoint) => {
   if (cp.toString() === currentControlPoint._id.toString()) return true;
   else return false;
};

const isIncorrectLocalWithRoutes = (route, currentControlPoint) => {
   if (route.first_point.toString() === currentControlPoint._id.toString()) return route;
   if (route.second_point.toString() === currentControlPoint._id.toString()) return route;
   return null;
};
