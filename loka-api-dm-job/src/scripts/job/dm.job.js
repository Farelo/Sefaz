const debug = require('debug')('job:loka')
const dm_controller = require('../loka-integration/dm.controller')
const { Packing } = require('../../models/packings.model')
const moment = require('moment')

module.exports = async () => {
    
    try {

        while (true) {

            let concluded_devices = 0
            let error_devices = 0
            let timeInit = new Date().getTime();
            let sleepTime = 10*60

            debug("***********************")

            const cookie = await dm_controller.loginDM()

            let devices = await Packing.find({ 'tag.code': '4073138' }, { _id: 1, tag: 1, last_position: 1 }).populate('last_device_data').populate('last_device_data_battery')

            for (const [i, packing] of devices.entries()) {
                try {
                    const week_in_milliseconds = 604800000

                    //recupera a última mensagem e cria janela de tempo. Se não houver, inicia 1 semana atrás
                    let startDate = packing.last_position ?
                        moment(packing.last_position.timestamp).add(1, 'seconds').format('YYYY-MM-DD HH:mm:ss').toString() :
                        moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss').toString();

                    let endDate = moment().utc().format('YYYY-MM-DD HH:mm:ss').toString()
                    
                    // console.log('original moment: ', moment(packing.last_device_data.message_date).format('YYYY-MM-DD HH:mm:ss').toString())
                    // console.log('original antigo: ', add_seconds(packing.last_device_data.message_date, 1))
                    // console.log('startDate: ', startDate)
                    // console.log('endDate: ', endDate)

                    // console.log(' ')

                    const newPositionsArray = await dm_controller.fetchAndSavePositions(packing, startDate, endDate, cookie);

                    // const newSensorsArray = await dm_controller.fetchAndSaveSensors(packing, startDate, endDate, cookie);

                    //debug(packing)
                    // debug(`Request ${i + 1}: ${packing.tag.code} | ${startDate} | ${endDate} | ${newPositionsArray.length} | ${newSensorsArray.length}\n`)

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