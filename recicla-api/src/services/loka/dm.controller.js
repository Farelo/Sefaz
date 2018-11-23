const dm_service = require('./dm.service');
const { isEmpty } = require('lodash');

module.exports = {
    confirmDevice: confirmDevice,
    getDeviceDataFromMiddleware: getDeviceDataFromMiddleware
}

/*
    Confirma se o device passado existe no sistema
*/
//TODO: pensar em mudar os retornos de string para booleanos
async function confirmDevice (deviceId){
    try {
        let cookie = await dm_service.loginLokaDmApi()
    
        let device = await dm_service.deviceById(cookie, deviceId)

        if (isEmpty(device))
     
           throw new Error(`Device ${deviceId} does not exist in the system.`);
        
        else
            // return(`Device ${deviceId} exists in the system.`);
            return Promise.resolve(`Device ${deviceId} exists in the system.`)
    
    } catch (error) {

        // throw new Error('Erro ocorrido ao tentar confirmar o device com a Loka. ' + error)
        return Promise.reject(error)
    }
}

/*
    Busca nas chamadas da API do middleware (Loka, por enquanto) os dados do device e retorna um novo objeto
    com os dados consolidados e padronizados.
*/
async function getDeviceDataFromMiddleware(deviceId, startDate, endDate, max) {

    try {
        let cookie = await dm_service.loginLokaDmApi()

        let data = await Promise.all([dm_service.positions(cookie, deviceId, null, true, startDate, endDate, max),
                                      dm_service.messagesFromSigfox(cookie, deviceId, startDate, endDate, max)
                                     ])

        let consolidatedMessages = await joinPartialMessages(data[0], data[1])
        
        // return consolidatedMessages
        return Promise.resolve(consolidatedMessages)
    } catch (error) {

        // throw new Error('Erro ocorrido ao tentar obter os dados das posições ou do sigfox. ' + error)
        return Promise.reject('Erro ocorrido ao tentar obter os dados das posições ou do sigfox. ' + error)
    }
}

/*
    Função que consolida dois arrays de mensagens complementares retornadas do Middleware (loka), em um novo array de mensagens
*/
function joinPartialMessages(lokaPositions, sigfoxMessages) {

    let consolidatedMessages = [];

    //faz uma varredura em cada posicao do array de posicoes da lokaPositions
    lokaPositions.map((lokaPosition) => {

        //compara a data da posição com a data da msg sigfox e se for igual, retorna a msg sigofx
        let sigfoxMatch = sigfoxMessages.find( sigfoxMessage => {  return sigfoxMessage.date === lokaPosition.date; });

        //data consolidation
        if (sigfoxMatch) {

            let newObject = {
                deviceId:lokaPosition.terminal.id,
                messageDate:lokaPosition.date,
                messageDateTimestamp: lokaPosition.timestamp,
                lastCommunication:lokaPosition.terminal.lastCommunicationString,
                lastCommunicationTimestamp: lokaPosition.terminal.lastCommunication,
                latitude:lokaPosition.latitude,
                longitude:lokaPosition.longitude,
                accuracy:lokaPosition.accuracy,
                battery: {
                    percentage:  searchProperty('Battery', sigfoxMatch.messageDecoded),
                    voltage:searchProperty('Battery Voltage', sigfoxMatch.messageDecoded)
                },
                temperature:searchProperty('Temperature', sigfoxMatch.messageDecoded),
                seqNumber: sigfoxMatch.seqNumber
            }
            
            consolidatedMessages.push(newObject);
        }
    });

    return consolidatedMessages;
}

/*
    Função para varrer o array messageDecoded retornado pela LOKA que contem subarrays com informações dos sensores

    Exemplo de messageDecoded:

        "messageDecoded": [ ["Temperature", "27&deg;C"], [], ["Battery Voltage", "2.96V"], [], ["Battery","83.1%"], [] ]

    propToFind := termo a ser buscado na posição 0 do subarray que contém informação

    messageDecoded := mensagem decodificada contida no retorno da loka sobre o device
*/
let searchProperty = function(propToFind, messageDecoded){
    
    let propertySet = messageDecoded.find(msg => {
        return msg[0] === propToFind;
    });

    if (propertySet) {

        if (propToFind === 'Temperature')
            return propertySet[1].substr(0, propertySet[1].indexOf('&'));
        
        else if (propToFind === 'Battery')
            return propertySet[1].substr(0, propertySet[1].indexOf('%'));
            // return propertySet[1].substr(0, propertySet[1].length - 1);

        else if (propToFind === 'Battery Voltage')
            return propertySet[1].substr(0, propertySet[1].indexOf('V'));
            // return propertySet[1].substr(0, propertySet[1].length - 1);

    }
    return null;
}