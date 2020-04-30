const debug = require('debug')('job:loka')
const dm_controller = require('../loka-integration/dm.controller')
const { Packing } = require('../../models/packings.model')
const { DeviceData, device_data_save } = require('../../models/device_data.model')

module.exports = async () => {
    
    try {

        while (true) {

            let concluded_devices = 0
            let error_devices = 0
            let timeInit = new Date().getTime();
            let sleepTime = 10*60

            debug("***********************")
            debug("Novo loop no while")
            debug("Login")

            const cookie = await dm_controller.loginDM()

            let devices = await Packing.find({}, { _id: 1, tag: 1, last_device_data: 1 }).populate('last_device_data').populate('last_device_data_battery')

            for (const [i, packing] of devices.entries()) {
                try {
                    const week_in_milliseconds = 604800000

                    //recupera a última mensagem e
                    //cria janela de tempo de uma semana antes da última mensagem enviada
                    let end_search_date = (new Date()).toLocaleString()
                    let start_search_date = packing.last_device_data ? add_seconds(packing.last_device_data.message_date, 1) : new Date(Date.parse(new Date()) - week_in_milliseconds)

                    //convete esse timestamp para string
                    start_search_date = start_search_date.toLocaleString()

                    //verifica na loka se o device existe
                    //await dm_controller.confirmDevice(packing.tag.code, cookie)

                    const device_data_array = await dm_controller.getDeviceDataFromMiddleware(packing.tag.code, start_search_date, end_search_date, null, cookie)

                    //debug(packing)
                    debug(`Request ${i + 1}: ${packing.tag.code} | ${start_search_date} | ${end_search_date} | ${device_data_array.length}`)

                    if (device_data_array) {
                        //debug(device_data_array)
                        await device_data_save(packing, device_data_array)

                        concluded_devices++

                        //nao precisa realizar o return device_data_array, a nao ser que queira debugar o loop for-await-for abaixo
                        // return device_data_array
                    }


                } catch (error) {

                    debug(`${i}: Erro ocorrido no device: ' + ${packing.tag.code} + ' | ' + ${error}`)

                    error_devices++
                }

            }

            let timeFinish = new Date().getTime();
            let timeTotal = timeFinish - timeInit

            debug(`Devices que deram certo:  ${concluded_devices}`)
            debug(`Devices que deram errado:  ${error_devices}`)
            debug(`Job LOKA encerrado em ${new Date().toISOString()} com sucesso!`)
            debug('Tempo total de execução (sec): ' + timeTotal / 1000)

            debug("Logout")

            await dm_controller.logoutDM(cookie)

            debug(`Dormir por ${sleepTime} segundos`)
            await promise_wait_seconds(sleepTime)
            debug("Acordado")
        }

    } catch (error) {
        return Promise.reject(`Job LOKA encerrado em ${new Date().toISOString()} com erro | ` + error)
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