const cron = require('node-cron')
const dm_job = require ('./dm.job')
const debug = require('debug')('cron-job:loka-dm-main')

//variável sinalizadora para o pŕoximo job de fato executar, essencial 
let next = true

module.exports = () => {
    cron.schedule(`* */1 * * * *`, async () => {
        // debug('job cron fora')

        if (next) {

            // debug('job cron dentro ')

            next = false

            // debug('next: ',next)

            //sincrono -> se tiver algo a rodar necessariamente após o termino da função exec(), que vai ser a chamada ao job
            await exec().then(res => {next = res; debug('job encerrado')}).catch(error => debug('job com erro: ', error))

            //assincrono
            // exec().then(res => {next = res; debug('job encerrado')}).catch(error => debug('job com erro: ', error))
            
            next = next == true ? next : false

            // debug('next: ',next)
        }
    })
}
let count = 0
//TODO: analisar quando a promise eh rejeitada
//ver o que acontece no cron (ver se tem relação com o travamento repentino do job)
const exec = () => {

    return new Promise(async (resolve, reject) => {

        try {
            let timeStart = new Date()

            await dm_job()

            count++

            debug('Job ' + count + ' encerrado com inicio em ', timeStart, ' e finalizado em ', new Date())
            
            resolve(true)

        } catch (error) {
            
            reject(error)

        }
    })
}