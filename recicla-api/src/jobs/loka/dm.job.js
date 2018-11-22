const debug = require('debug')('job:loka')
const dm_controller = require('../../services/loka/dm.controller')
const { Packing } = require('../../resources/packings/packings.model')
const { DeviceData } = require('../../resources/device_data/device_data.model')
// const packings = require('./devices')

//TODO: criar a rotina de job, aqui ou em outro ponto (feito)
//TODO: converter a data de busca obtida do banco para timezone local (feito)
//TODO: ver se usar no endDate apenas o new Date() é suficiente (feito)
//TODO: revisar os requires desnecessarios (feito)
//TODO: testar para muitos devices com startDate de 2 dias (feito)
//TODO: testar para muitos devices com startDate de meses (funciona até certo momento aí depois o job trava) encontrar o porquê
// |-> verificar se pode ser o Keep-alive timeout=5 e max=100
// |-> verificar se pode ser porque abro muitos logins e nao faço nenhum logout
// |-> se reapoveitar o cookie até ele expirar pode melhorar isso: cada login gera 1 cookie e cada device abre 2 cookies por execução do job: 1 para o confirm e 1 para o getData
//TODO: amanhã cedo implementar o request de logout no dm.service e executar esse logout aqui, após o save(), para cada device
//TODO: encontrar meio de obter de forma melhor uma data startDate quando nao houver device_data previamente
//TODO: criar logs melhores para os erros 

module.exports = async () => {
    //endDateSearch = currente environment timezone datetime
    const endDateSearch = (new Date()).toLocaleString()
    
    try {
        //devices = [ { tag: { code: code_value } } ]
        let devices = await Packing.find({}, {_id: 0, tag: 1})

        //TODO: retirar esse trecho pra entrega final e seu respectivo require
        // let devices = await packings
        // debug(devices)
        // let devices = [{ tag: { code: 999}},
        //     { tag: { code: 987}},
        //     { tag: { code: 985}},
        //     { tag: { code: 5040349}}
        // ]

        let i = 0
        let j = 0
        let total = devices.length

        let devices_data_promises = devices.map(async packing => {
            try {
                const last_message_date = await DeviceData.find({device_id: packing.tag.code}, {_id: 0, message_date: 1}).sort({message_date: 'desc'}).limit(1)

                let startDateSearch = last_message_date[0] ? add_seconds(last_message_date[0].message_date, 1) : new Date('2018-11-19 00:00:00')

                startDateSearch = startDateSearch.toLocaleString()

                await dm_controller.confirmDevice(packing.tag.code)
               
                // debug('Device ', packing.tag.code, ' confirmado na loka e data de busca a partir de ', startDateSearch)

                const data = await dm_controller.getDeviceDataFromMiddleware(packing.tag.code, startDateSearch, endDateSearch, null)

                if (data) {

                    await save_data_device(data)

                    i++
                    debug('Devices que deram certo: ', i, ' de ', total)
                }

            } catch (error) {

                debug('Erro no device: ' + packing.tag.code + ' | ' + error)

                j++
                debug('Devices que deram errado: ', j, ' de ', total)
            }
        })

        //esse for existe dessa maneira somente para garantir que cada promessa do array de promessas de devices seja finalizado (resolvido ou rejeitado) 
        for await(const device_data_promise of devices_data_promises) {

        }

    } catch (error) {

        return Promise.reject('Erro ao executar o job de busca na loka', error)
    }
}

const add_seconds = (date_time, seconds_to_add) => { return new Date(date_time.setSeconds(date_time.getSeconds() + seconds_to_add)) }

const save_data_device = async (data) => {
    for (device_data of data) {

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
    
                //salva no banco | observação: não salva mensagens iguais porque o model possui indice unico e composto por device_id e message_date,
                //e o erro de duplicidade nao interrompe o job
                await new_device_data.save( )
    
                // debug('Saved device_data from device ', device_data.deviceId, ' and message_date ', device_data.messageDate)
    
            } catch (error) {
                debug('Error to save device_data from ', device_data.deviceId, ' and message_date ', device_data.messageDate, ' | System Error ', error.errmsg ? error.errmsg : error.errors)
            }
    }
}