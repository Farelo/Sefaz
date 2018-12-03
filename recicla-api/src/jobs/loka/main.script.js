const cron = require('node-cron')
const dm_job = require ('./dm.job')
const debug = require('debug')('cron-job:loka-dm-main')

//variável sinalizadora para o pŕoximo job de fato executar, essencial 
let next = true
let count = 1

module.exports = () => {
    cron.schedule(`* */3 * * * *`, async () => {
        
        if (next) {

            next = false

            debug(`Job ${count} iniciado`)

            let timeStart = new Date()

            //sincrono -> se tiver algo a rodar necessariamente após o termino da função exec(), que vai ser a chamada ao job
            await exec().then(job_result => debug(job_result)).catch(error => debug(error))

            debug(`Job ${count} encerrado com inicio em  ${timeStart} e finalizado em  ${new Date()}`)

            count++

            next = true

            //assincrono
            // exec().then(res => {next = res; debug('job encerrado')}).catch(error => debug('job com erro: ', error))
            
            // next = next == true ? next : false
        }
    })
}

const exec = () => {

    return new Promise(async (resolve, reject) => {

        try {
            let job_result = await dm_job()

            resolve(job_result)

        } catch (error) {
            
            reject(error)
            
        }
    })
}