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
    id: "1"
}

const alerts = {
    SEM_SEM
}

const states = {
    DESABILITADA_COM_SINAL: { id: "desabilitadaComSinal", alert: undefined },
    DESABILITADA_SEM_SINAL: {
        id: "desabilitadaSemSinal",
        alert: undefined
    },
    ANALISE: {
        id: "analise",
        VIAGEM_PRAZO: "viagemEmPrazo",
        VIAGEM_ATRASADA: "viagemAtrasada",
        VIAGEM_AUSENTE: "Ausente",
        SEM_SINAL: "semSinal",
        PERDIDA: "perdida",
        LOCAL_CORRETO: "localCorreto",
        LOCAL_INCORRETO: "localIncorreto"
    }

    
}

let currentState;
function matchControlPoint(lat, long) {
    return { _id: 1123 }
    console.log("IMPLEMENTAR matchControlPoint")
} //DAVID

function controlPointOwner(id) {
    console.log("IMPLEMENTAR controlPointOwner")
} //DAVID

const method_u = function () {
    return { _id: '', nome: '' }
}

function packingLastSignal(id) {
    const s = method_u()
}

function runSM(user, packing, lastDeviceEntry) {
    let nextState;
    switch (currentState) {
        case states.ANALISE: // ******************************ANALISE**********************************
            if ((new Date().getTime() - packingLastSignal(packing.id)) < DAY1) {
                let localId = matchControlPoint(entry.lat, entry.long); //ATUALIZAR
                if (localId != undefined) {
                    let owner = controlPointOwner(localId); //ATUALIZAR
                    if ((owner == user.id) || (owner == packing.family.company.id)) {
                        //COMPLEMENTAR
                        nextState = states.LOCAL_CORRETO; //NEXT STATE
                    } else {
                        //COMPLEMENTAR
                        nextState = states.LOCAL_CORRETO; //NEXT STATE
                    }
                } else {
                    //CHECAR SE PRECISA CONTINUAR NO PRAZO DA VIAGEM
                    //COMPLEMENTAR
                    nextState = states.VIAGEM_PRAZO; //NEXT STATE
                }
            } else {
                nextState = states.SEM_SINAL; //NEXT STATE
            }
            break;
        case states.DESABILITADA_COM_SINAL: // ********************DESABILITADA_COM_SINAL*********************
            if (packing.active) {
                nextState = states.ANALISE; //NEXT STATE
            } else {
                let lastSignalDelay = (new Date().getTime() - packingLastSignal(packing.id));
                if (lastSignalDelay < DAY1) {
                    nextState = states.DESABILITADA_COM_SINAL;
                } else {
                    //COMPLEMENTAR
                    nextState = states.PERDIDA; //NEXT STATE
                }
            }
            break;
        case states.DESABILITADA_SEM_SINAL: // ***********************DESABILITADA_SEM_SINA***************************
            if (packing.active) {
                nextState = states.ANALISE; //NEXT STATE
            } else {
                let lastSignalDelay = (new Date().getTime() - packingLastSignal(packing.id));
                if (lastSignalDelay < DAY1) {
                    nextState = states.ANALISE;
                } else if (lastSignalDelay < DAY2) {
                    //COMPLEMENTAR
                    nextState = states.SEM_SINAL; //NEXT STATE
                } else {
                    //COMPLEMENTAR
                    nextState = states.PERDIDA; //NEXT STATE
                }
            }
            break;
        case states.VIAGEM_PRAZO: // ****************************VIAGEM_PRAZO*******************************
            break;
        case states.VIAGEM_ATRASADA: // ************************VIAGEM_ATRASADA******************************
            break;
        case states.VIAGEM_AUSENTE: // **************************VIAGEM_AUSENTE******************************
            break;
        case states.SEM_SINAL: // ******************************SEM_SINAL**********************************
            let lastSignalDelay = (new Date().getTime() - packingLastSignal(packing.id));
            if (lastSignalDelay < DAY1) {
                nextState = states.ANALISE;
            } else if (lastSignalDelay < DAY2) {
                //COMPLEMENTAR
                nextState = states.SEM_SINAL; //NEXT STATE
            } else {
                //COMPLEMENTAR
                nextState = states.PERDIDA; //NEXT STATE
            }
            break;
        case states.PERDIDA: // ******************************PERDIDA**********************************
            let lastSignalDelay = (new Date().getTime() - packingLastSignal(packing.id));
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
        case states.LOCAL_CORRETO: // ***************************LOCAL_CORRETO******************************
            break;
        case states.LOCAL_INCORRETO: // ***************************LOCAL_INCORRETO******************************
            break;
        default: // ******************************DEFAULT**********************************
            if (packing.active) {
                //COMPLEMENTAR
                nextState = states.ANALISE; //NEXT STATE
            } else {
                //COMPLEMENTAR
                nextState = states.DESABILITADA_COM_SINAL; //NEXT STATE
            }
            break;
    }
} 