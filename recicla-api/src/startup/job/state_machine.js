fs = require('fs')

fs.readFile('input.txt', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    console.log(data.split(";"));
});

console.log((new Date()).now());

const DAY1 = 1000 * 60 * 60 * 24;
const DAY2 = DAY1 * 2;

let entry = {
    id: "1",
    tag: "5689548",
    lat: "41.02",
    long: "62.54",
    accurancy: "32000",
    battery: "85",
    time: "1539004221"
}

let packing = {
    id: "1",
    currentState: "analise",
    family: currentfamily,
    active: true
}

let currentfamily = {
    code: "LD",
    company: "3",
    routes: undefined
}

let userConfig = {
    defaultAcceptableMinimalAccuracy: "1000",
    id: "1",
    batteryThreshold: "20" 
}

const events = {
    INBOUND: "inbound",
    OUTBOUND: "outbound",
    DISABLING: "disabling",
    ENABLING: "enabling"
}

const alerts = {
    SEM_SINAL: "a_semsinal",
    PERDIDA: "a_perdida",
    VIAGEM_ATRASADA: "a_viagemAtrasada",
    VIAGEM_AUSENTE: "a_viagemAusente",
    LOCAL_INCORRETO: "a_semsinal",
    BATERIA: "a_bateria",
    AUSENTE: "a_ausente",
    NBATERIA: "a_nbateria",
    NAUSENTE: "a_nausente"
}

const states = {
    DESABILITADA_COM_SINAL: {
        id: "desabilitadaComSinal", 
        alert: undefined
    },
    DESABILITADA_SEM_SINAL: {
        id: "desabilitadaSemSinal",
        alert: SEM_SINAL
    },
    ANALISE: {
        id: "analise",
        alert: undefined
    },
    VIAGEM_PRAZO: {
        id: "viagemEmPrazo",
        alerta: undefined
    },
    VIAGEM_ATRASADA: {
        id: "viagemAtrasada",
        alert: alerts.VIAGEM_ATRASADA
    },
    VIAGEM_AUSENTE: {
        id: "Ausente",
        alert: alerts.VIAGEM_AUSENTE
    },
    SEM_SINAL: {
        id: "semSinal",
        alerts: alerts.SEM_SINAL
    },
    PERDIDA: {
        id: "perdida",
        alert: alerts.PERDIDA
    },
    LOCAL_CORRETO: {
        id: "localCorreto",
        alert: undefined
    },
    LOCAL_INCORRETO: {
        id: "localIncorreto",
        alert: alerts.LOCAL_INCORRETO
    }
}

let currentState;
function matchControlPoint(lat, long) {
    return { _id: 1123 }
    console.log("IMPLEMENTAR matchControlPoint")
} //DAVID

function controlPointOwner(id) {
    return {_id: 12}
    console.log("IMPLEMENTAR controlPointOwner")
} //DAVID

function getLastAccurateEntry(packingID) {
    return {
        _id: "5689543",
        lat: "32.2", 
        long: "32.89", 
        accurancy: "13",
        battery: "69",
        timestamp: "1539092642"
    }
}

function getLastEntry(packingID) {
    return {
        _id: "5689541",
        lat: "54.2",
        long: "27.05",
        accurancy: "32000",
        battery: "84",
        timestamp: "1539092720"
    }
}

function getLastEventFromOwner(packing,eventType){
    //se eventType for undefined, o tipo é indiferente
    return {
        _id: 12,
        packing: "5689541",
        control_point: "aaaaa",
        timestamp: "1539095720"
    }
}

function getLastOutDisablingEventFromOwner(packing) {
    return {
        _id: 12,
        packing: "5689541",
        control_point: undefined,
        timestamp: "1539092720"
    }
}

function getAllowedControlPoints(packing){
    return {controlPoints: [1,2,5,7,8,9,12,14,43,65,23,54]}
}

function hasRoute(){}
function hasGC16(){}

function checkAbsence(packing) {
    let lastEvent = getLastEventFromOwner(packing, undefined);
    if ((lastEvent == event.DISABLING || lastEvent == events.OUTBOUND) && ((new Date().getTime() - lastEvent.timestamp) > userConfig.absentTime)) {
        return true;
    } else {
        return false;
    }
}

function checkBattery(packing) {
    return (packing.battery < userConfig.batteryThreshold) ? true : false;
}

function setStateAlert(packing, alert) {}
function setAttributeAlert(packing, alert) { }

function runSM(user, packing) {
    let nextState;
    let lastEntry = getLastEntry(packing.id);
    let lastAccurateEntry = getLastAccurateEntry(packing.id);
    let lastSignalDelay = (new Date().getTime() - lastEntry.timestamp);
    switch (currentState) {
        // ******************************ANALISE*******************************
        case states.ANALISE: 
            if (lastSignalDelay < DAY1) {
                let localId = matchControlPoint(lastAccurateEntry.lat, lastAccurateEntry.long); //ATUALIZAR
                if (localId != undefined) {
                    let owner = controlPointOwner(localId); //ATUALIZAR
                    if ((owner == user.id) || (owner == packing.family.company.id)) {
                        //COMPLEMENTAR
                        nextState = states.LOCAL_CORRETO; //NEXT STATE
                    } else {
                        //COMPLEMENTAR
                        nextState = states.LOCAL_INCORRETO; //NEXT STATE
                    }
                } else {
                    //CHECAR SE PRECISA CONTINUAR NO PRAZO DA VIAGEM
                    //COMPLEMENTAR
                    nextState = states.VIAGEM_PRAZO; //NEXT STATE
                }
            } else {
                //ADICIONAR ALERTA
                nextState = states.SEM_SINAL; //NEXT STATE
            }
            break;
        // ********************DESABILITADA_COM_SINAL*********************
        case states.DESABILITADA_COM_SINAL: 
            if (packing.active) {
                nextState = states.ANALISE; //NEXT STATE
            } else {
                if (lastSignalDelay < DAY1) {
                    nextState = states.DESABILITADA_COM_SINAL;
                } else {
                    //COMPLEMENTAR
                    nextState = states.DESABILITADA_SEM_SINAL; //NEXT STATE
                }
            }
            break;
        // ***********************DESABILITADA_SEM_SINA***************************
        case states.DESABILITADA_SEM_SINAL: 
            if (packing.active) {
                nextState = states.SEM_SINAL; //NEXT STATE
            } else {
                if (lastSignalDelay < DAY1) {
                    nextState = states.DESABILITADA_COM_SINAL;
                } else if (lastSignalDelay < DAY2) {
                    //COMPLEMENTAR
                    nextState = states.DESABILITADA_SEM_SINAL; //NEXT STATE
                } else {
                    //COMPLEMENTAR
                    nextState = states.PERDIDA; //NEXT STATE
                }
            }
            break;
        // ****************************VIAGEM_PRAZO*******************************
        case states.VIAGEM_PRAZO: 
            if (packing.active) {

                nextState = states.SEM_SINAL; //NEXT STATE
            } else {
                nextState = states.DESABILITADA_COM_SINAL; //NEXT STATE
            }
            break;
        // ************************VIAGEM_ATRASADA******************************
        case states.VIAGEM_ATRASADA: 
            break;
        // **************************VIAGEM_AUSENTE******************************
        case states.VIAGEM_AUSENTE: 
            break;
        // ******************************SEM_SINAL**********************************
        case states.SEM_SINAL: 
            if (packing.active) {
                if (lastSignalDelay < DAY1) {
                    nextState = states.ANALISE;
                } else if (lastSignalDelay < DAY2) {
                    //COMPLEMENTAR
                    nextState = states.SEM_SINAL; //NEXT STATE
                } else {
                    //COMPLEMENTAR
                    nextState = states.PERDIDA; //NEXT STATE
                }
            } else {    
                nextState = states.DESABILITADA_SEM_SINAL; //NEXT STATE
            }
            break;
        // ******************************PERDIDA**********************************
        case states.PERDIDA: 
            if (lastSignalDelay < DAY2) {
                if (packing.active) {
                    //COMPLEMENTAR
                    nextState = states.ANALISE; //NEXT STATE
                } else {
                    //COMPLEMENTAR
                    nextState = states.DESABILITADA_COM_SINAL; //NEXT STATE
                }
            } else {
                nextState = states.PERDIDA; //NEXT STATE
            }
            break;
        // ***************************LOCAL_CORRETO******************************
        case states.LOCAL_CORRETO: 
            if (packing.active) {
                if (lastSignalDelay < DAY1) {
                    let localId = matchControlPoint(lastAccurateEntry.lat, lastAccurateEntry.long); //ATUALIZAR
                    if (localId != undefined) {
                        //ATUALIZAR POSIÇÃO
                        let owner = controlPointOwner(localId); //ATUALIZAR
                        if ((owner == user.id) || (owner == packing.family.company.id)) {
                            //COMPLEMENTAR
                            nextState = states.LOCAL_CORRETO; //NEXT STATE
                        } else {
                            //COMPLEMENTAR
                            nextState = states.LOCAL_INCORRETO; //NEXT STATE
                        }
                    }else{
                        nextState = states.VIAGEM_PRAZO;
                    }
                }else{
                    nextState = states.SEM_SINAL; //NEXT STATE
                }
            } else {
                nextState = states.DESABILITADA_COM_SINAL; //NEXT STATE
            }
            break;
        // ***************************LOCAL_INCORRETO******************************
        case states.LOCAL_INCORRETO: 
            if (packing.active) {
                if (lastSignalDelay < DAY1) {
                    let localId = matchControlPoint(lastAccurateEntry.lat, lastAccurateEntry.long); //ATUALIZAR
                    if (localId != undefined) {
                        //ATUALIZAR POSIÇÃO
                        let owner = controlPointOwner(localId); //ATUALIZAR
                        if ((owner == user.id) || (owner == packing.family.company.id)) {
                            nextState = states.LOCAL_CORRETO; //NEXT STATE
                        } else {
                            //COMPLEMENTAR
                            nextState = states.LOCAL_INCORRETO; //NEXT STATE
                        }
                    } else {
                        nextState = states.VIAGEM_PRAZO;
                    }
                }else{
                    nextState = states.SEM_SINAL; //NEXT STATE
                }
            } else {
                nextState = states.DESABILITADA_COM_SINAL; //NEXT STATE
            }
            break;
        // ******************************DEFAULT**********************************
        default: 
            if (packing.active) {
                //COMPLEMENTAR
                nextState = states.ANALISE; //NEXT STATE
            } else {
                //COMPLEMENTAR
                nextState = states.DESABILITADA_COM_SINAL; //NEXT STATE
            }
            break;
    }
    checkAbsence(packing) ? setAttributeAlert(alerts.AUSENTE) : setAttributeAlert(alerts.NAUSENTE);
    checkBattery(packing) ? setAttributeAlert(alerts.BATERIA) : setAttributeAlert(alerts.NBATERIA);
    setStateAlert(nextState.alert);
} 