const readFilePromise = require('fs-readfile-promise')
const ora = require('ora')
const { Company} = require('../models/companies.model')
const { Family } = require('../models/families.model')
const { Packing } = require('../models/packings.model')
const { DeviceData } = require('../models/device_data.model')

const spinner = ora('Loading job...')

async function loadPackings() {
    try {
        spinner.start('Creating packings')
        const filePath = 'src/scripts/packings.txt'
        const data = await readFilePromise(filePath, 'utf8')
        const dataArray = data.split("\r\n")

        const company = await Company.create({name: 'CEBRACEC', type: 'owner'})
        const family = await Family.create({code: 'CODEA', company: company._id})

        dataArray.forEach(async log => {
            try {
                let attrib = log.split(",")
                let obj = {}

                obj = {
                    family: family._id,
                    tag: {
                        code: attrib[0],
                        version: attrib[1],
                        manufactorer: attrib[2],
                    },
                    serial: attrib[3],
                    type: attrib[4],
                    weigth: attrib[5],
                    width: attrib[6],
                    heigth: attrib[7],
                    length: attrib[8],
                    capacity: attrib[9],
                    active: true
                }

                await Packing.create(obj)
            } catch (err) {
                throw new Error(err)
            }
        })
        spinner.stop('Packings created')
    } catch (error) {
        console.log(error)
        return undefined
    }
}

module.exports = loadPackings

// async function loadDeviceLog() {
//     try {
//         spinner.start()
//         let dLogs = [];
//         const filePath = 'src/scripts/device_data.txt'

//         const data = await readFilePromise(filePath, 'utf8')
//         const dataArray = data.split("\r\n")

//         dLogs = dataArray.forEach(async log => {
//             try {
//                 let attrib = log.split(",");
//                 let obj = {}
//                 obj = {
//                     device_id: attrib[1],
//                     message_date: attrib[2],
//                     last_communication: attrib[3],
//                     latitude: attrib[4],
//                     longitude: attrib[5],
//                     accuracy: attrib[6],
//                     battery: {
//                         percentage: attrib[7],
//                         voltage: attrib[8]
//                     },
//                     temperature: attrib[9],
//                     seq_number: attrib[10]
//                 }

//                 await DeviceData.create(obj)
//             } catch (error) {
//                 throw new Error(error)
//             }
//         })

//         // await DeviceData.insertMany(dLogs)
//         spinner.succeed(['Tudo certo!'])
//     } catch (error) {
//         console.log(error)
//         throw new Error(error)
//     }
// }

// module.exports = loadDeviceLog

// const userConfig = {
//     defaultAcceptableMinimalAccuracy: 1000,
//     id: 1,
//     batteryThreshold: 20
// }

// async function getLastEntry(packing) {
//     const res = await loadDeviceLog()
//     for (i = res.length; i--; i >= 0) {
//         if (packing.tag.code == res[i].deviceId) {
//             return res[i]
//         }
//     }
//     return undefined
// }

async function getLastAccurateEntry(packing) {
    const res = await loadDeviceLog()
    console.log("++" + res.length)
    for (i = res.length; i--; i >= 0) {
        console.log(">" + i)
        if ((packing.tag.code == res[i].deviceId) && (res[i].accuracy <= userConfig.defaultAcceptableMinimalAccuracy)) {
            return res[i]
        }
    }
    return undefined

}

// const main = async () => {
//     //const res = await loadDeviceLog()
//     const pack = await loadPackings()
//     pack.forEach(element => {
//         runSM(userConfig, element)
//     });
//     pack.forEach(element => {
//         runSM(userConfig, element)
//     });
//     pack.forEach(element => {
//         runSM(userConfig, element)
//     });
//     pack.forEach(element => {
//         console.log(element.tag.code + " - " + element.current_state)
//     });
// }

// main()
// exports.main = main 

// const DAY1 = 1000 * 60 * 60 * 24;
// const DAY2 = DAY1 * 2;

// routes1 = [{
//     _id: "1",
//     first_point: "1",
//     first_point: "2",
//     packing_family: "LD",
//     travaling_time: {
//         max: "10",
//         min: "20"
//     }
// }, {
//     _id: "2",
//     first_point: "1",
//     first_point: "3",
//     packing_family: "LR",
//     travaling_time: {
//         max: "10",
//         min: "20"
//     }
// }, {
//     _id: "3",
//     first_point: "3",
//     first_point: "4",
//     packing_family: "LD",
//     travaling_time: {
//         max: "10",
//         min: "20"
//     }
// }]

// let currentfamily = {
//     code: "LD",
//     company: "3",
//     routes: routes1
// }

// let packing = {
//     id: "1",
//     currentState: "analise",
//     family: currentfamily,
//     active: true
// }

// const events = {
//     INBOUND: "inbound",
//     OUTBOUND: "outbound",
//     DISABLING: "disabling",
//     ENABLING: "enabling"
// }

// const alerts = {
//     SEM_SINAL: "a_semsinal",
//     PERDIDA: "a_perdida",
//     VIAGEM_ATRASADA: "a_viagemAtrasada",
//     VIAGEM_AUSENTE: "a_viagemAusente",
//     LOCAL_INCORRETO: "a_semsinal",
//     BATERIA: "a_bateria",
//     AUSENTE: "a_ausente",
//     NBATERIA: "a_nbateria",
//     NAUSENTE: "a_nausente"
// }

// const states = {
//     DESABILITADA_COM_SINAL: {
//         id: "desabilitadaComSinal",
//         alert: undefined
//     },
//     DESABILITADA_SEM_SINAL: {
//         id: "desabilitadaSemSinal",
//         alert: alerts.SEM_SINAL
//     },
//     ANALISE: {
//         id: "analise",
//         alert: undefined
//     },
//     VIAGEM_PRAZO: {
//         id: "viagemEmPrazo",
//         alerta: undefined
//     },
//     VIAGEM_ATRASADA: {
//         id: "viagemAtrasada",
//         alert: alerts.VIAGEM_ATRASADA
//     },
//     VIAGEM_AUSENTE: {
//         id: "Ausente",
//         alert: alerts.VIAGEM_AUSENTE
//     },
//     SEM_SINAL: {
//         id: "semSinal",
//         alert: alerts.SEM_SINAL
//     },
//     PERDIDA: {
//         id: "perdida",
//         alert: alerts.PERDIDA
//     },
//     LOCAL_CORRETO: {
//         id: "localCorreto",
//         alert: undefined
//     },
//     LOCAL_INCORRETO: {
//         id: "localIncorreto",
//         alert: alerts.LOCAL_INCORRETO
//     }
// }

// function matchControlPoint(lat, long) {
//     return {
//         _id: 1123
//     }
//     console.log("IMPLEMENTAR matchControlPoint")
// } //DAVID

// function controlPointOwner(id) {
//     return {
//         _id: 12
//     }
//     console.log("IMPLEMENTAR controlPointOwner")
// } //DAVID

// function getLastEventFromOwner(packing, eventType) {
//     //se eventType for undefined, o tipo é indiferente
//     return {
//         _id: 12,
//         packing: "5689541",
//         control_point: "aaaaa",
//         timestamp: "1539095720"
//     }
// }

// function getLastOutDisablingEventFromOwner(packingID) {
//     return {
//         _id: 12,
//         packing: "5689541",
//         control_point: undefined,
//         timestamp: "1539092720"
//     }
// }

// function getAllowedControlPoints(packingID) {
//     return {
//         controlPoints: [1, 2, 5, 7, 8, 9, 12, 14, 43, 65, 23, 54]
//     }
// }

// function getRoutes(packingID) {
//     //getPacking.
//     return packing.family.routes;
// }

// function hasGC16(packing) { }

// function checkAbsence(packing) {
//     let lastEvent = getLastEventFromOwner(packing, undefined);
//     if ((lastEvent == events.DISABLING || lastEvent == events.OUTBOUND) &&
//         ((new Date().getTime() - lastEvent.timestamp) > userConfig.absentTime)) {
//         return true;
//     } else {
//         return false;
//     }
// }

// function checkBattery(packing) {
//     return (packing.battery < userConfig.batteryThreshold) ? true : false;
// }

// function insertAlert(packing, alert) {
//     console.log("-------------------------Add Alert" + alert + " to " + packing.tag.code)
// }

// function setState(packing, state) {
//     packing.current_state = state.id
//     console.log("=================" + state.alert)
//     if (state.alert != undefined) {
//         insertAlert(packing, state.alert)
//     }
// }

// function setAttributeAlert(packing, alert) {
//     switch (alert) {
//         case alerts.BATERIA:
//             packing.low_battery = true;
//             break;
//         case alerts.NBATERIA:
//             packing.low_battery = false;
//             break;
//         case alerts.AUSENTE:
//             packing.absent = true;
//             break;
//         case alerts.NAUSENTE:
//             packing.absent = false;
//             break;
//     }
// }

// function runSM(user, packing) {
//     let nextState;
//     let currentState = packing.current_state == '' ? undefined : packing.current_state;
//     console.log(currentState)
//     let lastEntry = getLastEntry(packing);
//     let lastAccurateEntry = getLastAccurateEntry(packing);
//     let lastSignalDelay = (new Date().getTime() - lastEntry.timestamp);
//     switch (currentState) {
//         // ******************************ANALISE*******************************
//         case states.ANALISE.id:
//             if (lastSignalDelay < DAY1) {
//                 let localId = matchControlPoint(lastAccurateEntry.lat, lastAccurateEntry.long); //ATUALIZAR
//                 if (localId != undefined) {
//                     let owner = controlPointOwner(localId); //ATUALIZAR
//                     if ((owner == user.id) || (owner == packing.family.company.id)) {
//                         //COMPLEMENTAR
//                         nextState = states.LOCAL_CORRETO; //NEXT STATE
//                     } else {
//                         //COMPLEMENTAR
//                         nextState = states.LOCAL_INCORRETO; //NEXT STATE
//                     }
//                 } else {
//                     //CHECAR SE PRECISA CONTINUAR NO PRAZO DA VIAGEM
//                     //COMPLEMENTAR
//                     nextState = states.VIAGEM_PRAZO; //NEXT STATE
//                 }
//             } else {
//                 //ADICIONAR ALERTA
//                 nextState = states.SEM_SINAL; //NEXT STATE
//             }
//             break;
//         // ********************DESABILITADA_COM_SINAL*********************
//         case states.DESABILITADA_COM_SINAL.id:
//             if (packing.active) {
//                 nextState = states.ANALISE; //NEXT STATE
//             } else {
//                 if (lastSignalDelay < DAY1) {
//                     nextState = states.DESABILITADA_COM_SINAL;
//                 } else {
//                     //COMPLEMENTAR
//                     nextState = states.DESABILITADA_SEM_SINAL; //NEXT STATE
//                 }
//             }
//             break;
//         // ***********************DESABILITADA_SEM_SINA***************************
//         case states.DESABILITADA_SEM_SINAL.id:
//             if (packing.active) {
//                 nextState = states.SEM_SINAL; //NEXT STATE
//             } else {
//                 if (lastSignalDelay < DAY1) {
//                     nextState = states.DESABILITADA_COM_SINAL;
//                 } else if (lastSignalDelay < DAY2) {
//                     //COMPLEMENTAR
//                     nextState = states.DESABILITADA_SEM_SINAL; //NEXT STATE
//                 } else {
//                     //COMPLEMENTAR
//                     nextState = states.PERDIDA; //NEXT STATE
//                 }
//             }
//             break;
//         // ****************************VIAGEM_PRAZO*******************************
//         case states.VIAGEM_PRAZO.id:
//             if (packing.active) {
//                 nextState = states.SEM_SINAL; //NEXT STATE
//             } else {
//                 nextState = states.DESABILITADA_COM_SINAL; //NEXT STATE
//             }
//             break;
//         // ************************VIAGEM_ATRASADA******************************
//         case states.VIAGEM_ATRASADA.id:
//             break;
//         // **************************VIAGEM_AUSENTE******************************
//         case states.VIAGEM_AUSENTE.id:
//             break;
//         // ******************************SEM_SINAL**********************************
//         case states.SEM_SINAL.id:
//             if (packing.active) {
//                 if (lastSignalDelay < DAY1) {
//                     nextState = states.ANALISE;
//                 } else if (lastSignalDelay < DAY2) {
//                     //COMPLEMENTAR
//                     nextState = states.SEM_SINAL; //NEXT STATE
//                 } else {
//                     //COMPLEMENTAR
//                     nextState = states.PERDIDA; //NEXT STATE
//                 }
//             } else {
//                 nextState = states.DESABILITADA_SEM_SINAL; //NEXT STATE
//             }
//             break;
//         // ******************************PERDIDA**********************************
//         case states.PERDIDA.id:
//             if (lastSignalDelay < DAY2) {
//                 if (packing.active) {
//                     //COMPLEMENTAR
//                     nextState = states.ANALISE; //NEXT STATE
//                 } else {
//                     //COMPLEMENTAR
//                     nextState = states.DESABILITADA_COM_SINAL; //NEXT STATE
//                 }
//             } else {
//                 nextState = states.PERDIDA; //NEXT STATE
//             }
//             break;
//         // ***************************LOCAL_CORRETO******************************
//         case states.LOCAL_CORRETO.id:
//             if (packing.active) {
//                 if (lastSignalDelay < DAY1) {
//                     let localId = matchControlPoint(lastAccurateEntry.lat, lastAccurateEntry.long); //ATUALIZAR
//                     if (localId != undefined) {
//                         //ATUALIZAR POSIÇÃO
//                         let owner = controlPointOwner(localId); //ATUALIZAR
//                         if ((owner == user.id) || (owner == packing.family.company.id)) {
//                             //COMPLEMENTAR
//                             nextState = states.LOCAL_CORRETO; //NEXT STATE
//                         } else {
//                             //COMPLEMENTAR
//                             nextState = states.LOCAL_INCORRETO; //NEXT STATE
//                         }
//                     } else {
//                         nextState = states.VIAGEM_PRAZO;
//                     }
//                 } else {
//                     nextState = states.SEM_SINAL; //NEXT STATE
//                 }
//             } else {
//                 nextState = states.DESABILITADA_COM_SINAL; //NEXT STATE
//             }
//             break;
//         // ***************************LOCAL_INCORRETO******************************
//         case states.LOCAL_INCORRETO.id:
//             if (packing.active) {
//                 if (lastSignalDelay < DAY1) {
//                     let localId = matchControlPoint(lastAccurateEntry.lat, lastAccurateEntry.long); //ATUALIZAR
//                     if (localId != undefined) {
//                         //ATUALIZAR POSIÇÃO
//                         let owner = controlPointOwner(localId); //ATUALIZAR
//                         if ((owner == user.id) || (owner == packing.family.company.id)) {
//                             nextState = states.LOCAL_CORRETO; //NEXT STATE
//                         } else {
//                             //COMPLEMENTAR
//                             nextState = states.LOCAL_INCORRETO; //NEXT STATE
//                         }
//                     } else {
//                         nextState = states.VIAGEM_PRAZO;
//                     }
//                 } else {
//                     nextState = states.SEM_SINAL; //NEXT STATE
//                 }
//             } else {
//                 nextState = states.DESABILITADA_COM_SINAL; //NEXT STATE
//             }
//             break;
//         // ******************************DEFAULT**********************************
//         default:
//             if (packing.active) {
//                 //COMPLEMENTAR
//                 nextState = states.ANALISE; //NEXT STATE
//             } else {
//                 //COMPLEMENTAR
//                 nextState = states.DESABILITADA_COM_SINAL; //NEXT STATE
//             }
//             break;
//     }
//     checkAbsence(packing) ? setAttributeAlert(packing, alerts.AUSENTE) : setAttributeAlert(packing, alerts.NAUSENTE);
//     checkBattery(packing) ? setAttributeAlert(packing, alerts.BATERIA) : setAttributeAlert(packing, alerts.NBATERIA);
//     setState(packing, nextState);
// }

// module.exports = main