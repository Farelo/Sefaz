const debug = require('debug')('job:loka')
const cron = require('node-cron')
const packing_service = require('../../resources/packings/packings.service')
const dm_controller = require('../../services/loka/dm.controller')
const { DeviceData } = require('../../resources/device_data/device_data.model')
const packings = require('./devices')


const save_data_device = async (data) => {
    
    //mudar de foreach para um loop normal
    //motivo: o foreach, mesmo com asyn/await nao garante a gravação na ordem os indices do array data...pq lança o callback "ao mesmo tempo"
    data.forEach(async device_data => {

        try {

            const new_device_data = new DeviceData({
                device_id: device_data.deviceId.toString(),
                message_date: new Date(device_data.messageDate),
                message_date_timestamp: device_data.messageDateTimestamp,
                last_communication: new Date(device_data.lastCommunication),
                last_communication_timestamp: device_data.lastCommunicationTimestamp,
                latitude: device_data.latitude,
                longitude: device_data.longitude,
                accuracy: device_data.accuracy,
                temperature: device_data.temperature,
                seq_number: device_data.seqNumber,
                battery: {
                    percentage: device_data.battery.percentage,
                    voltage: device_data.battery.voltage
                }
            }) 

            //salva no banco | observação: não salva mensagens iguais porque o model possui indice unico e composto por device_id e message_date
            await new_device_data.save( )

            // debug('Saved device_data from device ', device_data.deviceId, ' and message_date ', device_data.messageDate)

        } catch (error) {
            debug('Error to save device_data from ', device_data.deviceId, ' and message_date ', device_data.messageDate, ' | System Error ', error.errmsg ? error.errmsg : error.errors)
        }
    })
}

// const job = cron.schedule(``, async () => {
const job = async() => {

    //trocar isso pelo lastEndSearch a ser criado ainda
    const startDateSearch = '2018-11-11 18:00:00'
    
    const currDate = new Date()
    
    const endDateSearch = currDate.toISOString().split('T')[0] + ' ' + currDate.toISOString().split('T')[1].substr(0, 8)
    
    try {

        // let devices = await packing_service.get_packings()
        
        let devices = await packings

        //para testes - deletar depois
        // devices = [
        //     { tag: { code: 5042520 } },
        //     { tag: { code: 5041472 } }
        // // //     // ,
        // // //     // { tag: { code: 4105232 } },
        // // //     // { tag: { code: '410523112jh' } },
        // //     { tag: { code: 5042398 } }
        // ]

        /*  
                devices.map executa o callback para os devices na ordem original

                    ex: devices = [1, 2, 3]
                        devices.map executa callback(1), callback(2), callback(3)
        */
        let devices_data_promises = devices.map(async packing => {
            debug('Iniciando busca de mensagens do device ', packing.tag.code)
            try {
                /*  
                    antes do await, a ordem ainda era confirmDevice(1), confirmDevice(2), confirmDevice(3)

                    retornou a seguitne ordem: 
                */

                //await: aguarda NECESSARIAMENTE a confirmação da validação do device com a LOKA
                await dm_controller.confirmDevice(packing.tag.code)
                debug('Device ', packing.tag.code, ' confirmado na loka')
                /*  
                    apos o await, a ordem de resultado pode variar conforme os resultados das promessas de confirmacao vão chegando

                    retornou na seguitne ordem: retorno de confirmDevice(1), retorno de confirmDevice(3), retorno de confirmDevice(2) 

                    e, a seguir, ja faz uma nova lista de promessas na mesma ordem dos retornos acima
                */

                //retorna uma promessa de que este device buscara as mensagens na loka
                return dm_controller.getDeviceDataFromMiddleware(packing.tag.code, startDateSearch, endDateSearch, null)

            } catch (error) {
                debug('invalid device: ' + packing.tag.code + ' ' + error)
            }

        })

        //assincronismo
        /*
            o return acima retornou 3 promessas (de exemplo) de busca dos dados no middleware na seguinte ordem:
                getDeviceDataFromMiddleware(1), getDeviceDataFromMiddleware(3), getDeviceDataFromMiddleware(2)

            abaixo percorremos um loop nessas promessas
        */
       let count = 0
        for (const device_data_promise of devices_data_promises) {


            const data = await device_data_promise
            
            debug('Busca concluida para mais um device ')
            /*
                o await novamente força que a promessa seja resolvida

                a ordem de resolução foi: 1, 2, 3

                assim, fica claro que o .map la em cima até inicia na ordem, mas o javascript com o asyn e o await trabalham juntos para realizar um papel
                assíncrono nessas requisições, a fim de permitir uma maior performance na obtenção de dados de MUITOS devices ao mesmo tempo
            */

            //se a promessa retornar dados, entao salva esses dados
            //gravação síncrona (um devicedID por vez)
            if (data)
                await save_data_device(data)
            
            count++
            debug('saved ', count, ' of ', devices_data_promises.length)
        }

    } catch (error) {
        debug('Erro ao executar o job de busca na loka')
        debug(error)
        throw new Error(error)
    }
}
// })

module.exports = job