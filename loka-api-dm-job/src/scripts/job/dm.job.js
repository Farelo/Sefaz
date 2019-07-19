const debug = require('debug')('job:loka')
const dm_controller = require('../loka-integration/dm.controller')
const { Packing } = require('../../models/packings.model')
const { DeviceData, device_data_save } = require('../../models/device_data.model')

module.exports = async () => {
    //end_search_date = currente environment timezone datetime
    const end_search_date = (new Date()).toLocaleString()
    
    const results = {}

    try {
        //const cookie = await dm_controller.loginDM()

        // let devices = [ { tag: { code: 4085902 } } ]
        let devices = await Packing.find({}, {_id: 0, tag: 1})//.limit(2)

        debug(devices)

        let concluded_devices = 0
        let error_devices = 0
        let total_devices = devices.length

        let device_data_promises = devices.map(async packing => {    
            
            // TODO Código para teste
            const cookie = await dm_controller.loginDM()
            
            try {
                //recupera a última mensagem
                const last_message_date = await DeviceData.find({device_id: packing.tag.code}, {_id: 0, message_date: 1}).sort({message_date: 'desc'}).limit(1)

                const week_in_milliseconds = 604800000

                //cria janela de tempo de uma semana antes da última mensagem enviada
                let start_search_date = last_message_date[0] ? add_seconds(last_message_date[0].message_date, 1) :  new Date(Date.parse(new Date()) - week_in_milliseconds)

                //convete esse timestamp para string
                start_search_date = start_search_date.toLocaleString()

                //verifica na loka se o device existe
                await dm_controller.confirmDevice(packing.tag.code, cookie)

                
                const device_data_array = await dm_controller.getDeviceDataFromMiddleware(packing.tag.code, start_search_date, end_search_date, null, cookie)

                if (device_data_array) {

                    await device_data_save(device_data_array)

                    concluded_devices++

                    //nao precisa realizar o return device_data_array, a nao ser que queira debugar o loop for-await-for abaixo
                    // return device_data_array
                }

            } catch (error) {

                debug('Erro ocorrido no device: ' + packing.tag.code + ' | ' + error)

                error_devices++
            }

            await promise_wait_seconds(3)
            // logout
            // TODO Código para teste
            await dm_controller.logoutDM(cookie)
        })

        //esse for existe dessa maneira somente para garantir que cada promessa do array de promessas de devices seja finalizado (resolvido ou rejeitado) 
        for await (const device_data_promise of device_data_promises) {
            
        }

        //await dm_controller.logoutDM(cookie)
        
        results.result1 = `Devices que deram certo:  ${concluded_devices} de ${total_devices}`

        results.result2 = `Devices que deram errado:  ${error_devices} de  ${total_devices}`

        results.result3 = `Job LOKA encerrado em ${new Date().toISOString()} com sucesso!`

        return Promise.resolve(results)

    } catch (error) {

        return Promise.reject(`Job LOKA encerrado em ${new Date().toISOString()} com erro | `, error)
    }
}

const add_seconds = (date_time, seconds_to_add) => { return new Date(date_time.setSeconds(date_time.getSeconds() + seconds_to_add)) }

const promise_wait_seconds = async seconds => {

    return new Promise((resolve) => {

        setTimeout(() => {
            resolve(`SLEEP: Aguardou ${seconds} segundos`)            
        }, seconds * 1000);

    })

}