const debug = require('debug')('job:loka')
const dm_controller = require('../loka-integration/dm.controller')
const { Packing } = require('../../models/packings.model')
const { DeviceData } = require('../../models/device_data.model')
// const packings = require('./devices')

//TODO: criar logs melhores para os erros 

module.exports = async () => {
    //end_search_date = currente environment timezone datetime
    const end_search_date = (new Date()).toLocaleString()
    
    const results = {}

    try {
        const cookie = await dm_controller.loginDM()

        //devices = [ { tag: { code: code_value } } ]
        let devices = await Packing.find({}, {_id: 0, tag: 1})//.limit(10)

        //TODO: retirar esse trecho pra entrega final e seu respectivo require
        // let devices = await packings
        debug(devices)
        // let devices = [{ tag: { code: 999}},
        //     { tag: { code: 987}},
        //     { tag: { code: 985}},
        //     { tag: { code: 5040349}}
        // ]

        let concluded_devices = 0
        let error_devices = 0
        let total_devices = devices.length

        let device_data_promises = devices.map(async packing => {

            try {
                const last_message_date = await DeviceData.find({device_id: packing.tag.code}, {_id: 0, message_date: 1}).sort({message_date: 'desc'}).limit(1)

                const week_in_milliseconds = 604800000

                let start_search_date = last_message_date[0] ? add_seconds(last_message_date[0].message_date, 1) :  new Date(Date.parse(new Date()) - week_in_milliseconds)

                start_search_date = start_search_date.toLocaleString()

                await dm_controller.confirmDevice(packing.tag.code, cookie)

                const data = await dm_controller.getDeviceDataFromMiddleware(packing.tag.code, start_search_date, end_search_date, null, cookie)

                if (data) {

                    await save_device_data(data)

                    concluded_devices++

                    //nao precisa realizar o return data, a nao ser que queira debugar o loop for-await-for abaixo
                    // return data
                }

            } catch (error) {

                debug('Erro ocorrido no device: ' + packing.tag.code + ' | ' + error)

                error_devices++
            }
        })

        //esse for existe dessa maneira somente para garantir que cada promessa do array de promessas de devices seja finalizado (resolvido ou rejeitado) 
        for await (const device_data_promise of device_data_promises) {
            
        }

        await dm_controller.logoutDM(cookie)
        
        results.result1 = `Devices que deram certo:  ${concluded_devices} de ${total_devices}`

        results.result2 = `Devices que deram errado:  ${error_devices} de  ${total_devices}`

        results.result3 = `Job LOKA encerrado em ${new Date().toISOString()} com sucesso!`

        return Promise.resolve(results)

    } catch (error) {

        return Promise.reject(`Job LOKA encerrado em ${new Date().toISOString()} com erro | `, error)
    }
}

const add_seconds = (date_time, seconds_to_add) => { return new Date(date_time.setSeconds(date_time.getSeconds() + seconds_to_add)) }

const save_device_data = async (data) => {
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
    
                // debug('Saved device_data ', device_data.deviceId, ' and message_date ', device_data.messageDate)
    
            } catch (error) {
                debug('Erro ao salvar o device_data do device  ', device_data.deviceId, ' para a data-hora ', device_data.messageDate, ' | System Error ', error.errmsg ? error.errmsg : error.errors)
            }
    }
}