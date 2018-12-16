const cron = require('node-cron')
const dm_job = require ('./job/dm.job')
const debug = require('debug')('cron-job:loka-dm-main')

//variável sinalizadora para o pŕoximo job de fato executar, essencial 
let next = true
let count = 1

module.exports = () => {
    cron.schedule(`* * * * * *`, async () => {
        
        if (next) {

            next = false

            debug(`Job ${count} iniciado`)

            let timeStart = new Date()

            //sincrono -> se tiver algo a rodar necessariamente após o termino da função exec(), que vai ser a chamada ao job
            await exec().then(job_result => debug(job_result)).catch(error => debug(error))

            debug(`Job ${count} encerrado com inicio em  ${timeStart} e finalizado em  ${new Date()}`)

            await promise_wait(10)

            count++

            next = true
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

//TODO: substituir esse promise_wait por um settimeout dentro do cron e chamar toda a execução no callback do settimeout
const promise_wait = async minutes => {

    return new Promise((resolve) => {

        setTimeout(() => {
            resolve(`Aguardou ${minutes} minutos`)            
        }, minutes * 1000 * 60);

    })

}