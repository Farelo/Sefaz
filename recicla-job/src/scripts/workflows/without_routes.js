const debug = require('debug')('job:without route')

// MODELS
const { Family } = require('../../models/families.model')

// const modelOperations = require('../common/model_operations')

// const evaluatesCurrentDepartment = require('../evaluators/evaluates_current_department')
// const evaluatesPlantInformation = require('../evaluators/evaluates_plant_information')
// const evaluatesPermanenceTime = require('../evaluators/evaluates_permanence_time')

// const historic = require('../historic/historic')

// const statusType = require('../common/status_type')
// const statusTypePt = require('../common/status_type_pt')
// const cleanObject = require('../common/cleanObject')
// const alertsType = require('../common/alerts_type')

/**
 * Avalia informações sobre a embalagem que não apresenta rota.
 * Os Alertas que podem ser geradors nesse modulo são apenas o de PERMANÊNCIA.
 * Os demais alertas como LOCAL INCORRETO, LATE, AUSENTE podem ser discartados
 * ja que os mesmos dependem de informações das rotas
 * São avaliadas as condições sobre a mesma, ou seja, se esta em um ponto de controle ou não.
 * A partir dessa definição é possivel inferir algumas alertas.
 * @param {Object} packing
 * @param {Object} currentControlPoint
 */
module.exports = async (packing, currentControlPoint) => {
    // debug('Packing without route.')

    if (currentControlPoint) {
        /* Quando uma embalagem está em um ponto de controle e a mesma não apresenta rotas, então
        *  Apenas algumas alertas podem explodir, como tempo de permanencia (BASEADO NO GC16, SE O MESMO EXISTIR)
        *  E tambem a questão da Bateria analisado previamente (O mesmo com perda de sinal) */

        // TODO: Checa na tabela de eventos se o currentControlPoint é o mesmo do último INBOUND da registro,
        // se for igual não fazemos nada, ela continua no mesmo lugar
        // se for diferente registramos o current INBOUND como um novo OUTBOUND e registramos um novo INBOUND

        // TODO: Se o GC16 existir, checar o tempo de permanência
        /* TODO: Checar se o currentControlPoint está entre os pontos de controle relacionados com a familia da embalagem: ALERT_TYPE.AUSENTE
        *  se ela estiver em um local correto não faz nada, se ela estiver em um local incorreto cria o alerta e chuva.
        */
        // TODO: Checar se o 
    }
    const currentFamily = await Family.findOne({ _id: packing.family })
    console.log(currentFamily)

    // // Verifica se embalagem esta em algum ponto de controle
    // if (currentControlPoint != null) {
    //     const oldPlant = packing.
    //     // Quando uma embalagem esta em um ponto de controle e a mesma não apresenta rotas, então
    //     // Apenas algumas alertas podem explodir, como tempo de permanencia (BASEADO NO GC16, SE O MESMO EXISTIR)
    //     // E tambem a questão da Bateria analisado previamente (O mesmo com perda de sinal)
    //     debug('Packing has plant.')
    //     // Avaliar sem tem departamento e o recupera
    //     const currentDepartment = await evaluatesCurrentDepartment(packing, currentControlPoint)
    //     packing = cleanObject.cleanFlags(packing) // limpa as flags
    //     packing = cleanObject.cleanMissing(packing) // limpa as informações sobre embalagem perdida
    //     packing = cleanObject.cleanTrip(packing) // limpa informações sobre a embalagem em viagem
    //     packing = cleanObject.cleanIncontida(packing) // limpa informações sobre a embalagem em viagem

    //     // Retorna informações sobre o tempo de permanencia da embalagem
    //     packing = await evaluatesPermanenceTime.evaluate(packing, currentControlPoint)
    //     // Coleta informações sobre a localização da embalagem
    //     packing = await evaluatesPlantInformation(packing, currentControlPoint, currentDepartment)

    //     if (packing.permanence.time_exceeded) {
    //         packing.status = statusType.PERMANENCE_EXCEEDED
    //         packing.status_pt = statusTypePt.PERMANENCE_EXCEEDED
    //     } else {
    //         packing.status = statusType.NORMAL
    //         packing.status_pt = statusTypePt.NORMAL
    //         await historic.initNormal(packing, oldPlant, currentControlPoint)
    //     }

    //     await modelOperations.update_packing(packing)
    // } else {
    //     // embalagem sem planta não há como inferir informações sobre
    //     // tempo de permanencia e outros alertas além do de bateria
    //     // que ja foi avaliado previamente (O mesmo com perda de sinal)
    //     debug('Packing without plant.')
    //     packing = cleanObject.cleanFlags(packing) // limpa as flags
    //     packing = cleanObject.cleanMissing(packing) // limpa as informações sobre embalagem perdida
    //     packing = cleanObject.cleanPermanence(packing) // limpa informações sobre o tempo de permanencia
    //     packing = cleanObject.cleanTrip(packing) // limpa informações sobre a embalagem em viagem

    //     // remove informações sobre a planta atual, pois a mesma pode ter sido relacionada anteriormente a um ponto de controle

    //     // quando a embalagem não esta associada a nenhuma rota e não esta em nnehum ponto de controle é interessante saber
    //     // se a mesma ja  era vinculada a algum ponto de controle , caso a mesma for é inserida informação sobre a ultima planta
    //     // em que foi vista
    //     packing.last_plant = packing.actual_plant
    //     packing.last_department = packing.department
    //     packing.status = statusType.INCONTIDA
    //     packing.status_pt = statusTypePt.INCONTIDA
    //     // atualiza informações sobre a mesma esta a primeira vez ou não incontida
    //     if (!packing.incontida.isIncontida) {
    //         packing.incontida = {
    //             date: new Date().getTime(),
    //             time: 0,
    //             isIncontida: true,
    //         }
    //         await historic.createIncontidaStatus(packing)
    //     } else {
    //         const timeInterval = new Date().getTime() - packing.incontida.date
    //         packing.incontida.time = timeInterval
    //         await historic.updateIncontidaStatus(packing)
    //     }

    //     await modelOperations.update_packing(packing)
    //     await modelOperations.update_packing_and_remove_actual_plant(packing)
    // }

    // await modelOperations.remove_alert(packing, alertsType.PERMANENCE)
    // await modelOperations.remove_alert(packing, alertsType.MISSING)
    // await modelOperations.remove_alert(packing, alertsType.LATE)
    // await modelOperations.remove_alert(packing, alertsType.INCORRECT_LOCAL)
    // // Não existe a necessidade de remover informações de planta da embalagem mesmo a mesma não
    // // apresentando rota, pois ela pode estar associada a algum ponto de controle no sistema mesmo não
    // // tendo rota
}