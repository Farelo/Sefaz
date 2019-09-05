const debug = require('debug')('job:loka')
const dm_controller = require('../loka-integration/dm.controller')
const { Packing } = require('../../models/packings.model')
const { DeviceData, device_data_save } = require('../../models/device_data.model')

module.exports = async () => {
    //end_search_date = currente environment timezone datetime
    const end_search_date = (new Date()).toLocaleString()
    
    const results = {}
    
    let concluded_devices = 0
    let error_devices = 0

    try {

        // let devices = [ { tag: { code: 4085902 } } ]
        let timeInit = new Date().getTime();

        let skip=0
        let jump=20
        let sleepTime=100
        let sleepped=0
        while(true){
            debug("Skip: "+skip)
            debug("Login")

            const cookie = await dm_controller.loginDM()

            //
            let ids = ['4085876', '4103925', '4085902', '4085443', '4082976', '4082610', '4103463', '4085580', '4085001', '4103073', '4085229', '4082619', '4084996', '4103766', '4102443', '4085255', '4085806', '4085235', '4082936', '4104016', '4085490', '4085790', '4082411', '4104026', '4103476', '4082626', '4083879', '4103759', '4082930', '4102148', '4085475', '4084959', '4104811', '4102803', '4105248', '4102452', '4085173', '4084861', '4085838', '4085237', '4100516', '4085462', '4104130', '4103946', '4104019', '4104798', '4085827', '4103599', '4073261', '4071487', '4082498', '4103938', '4100512', '4104349', '4073314', '4103982', '4103931', '4103976', '4085937', '4104794', '4103873', '4104772', '4085441', '4085213', '4086063', '4085788', '4103743', '4085176', '4082588', '4085162', '4103593', '4082927', '4103934', '4083577', '4084048', '4080508', '4080173', '4080947', '4096129', '4080953', '4080184', '4080387', '4081734', '4084184', '4073325', '4092598', '4104031', '4096435', '4104720', '4093450', '4102144', '4073323', '4083581', '4104992', '4103734', '4085240', '4085019', '4103811', '4083589', '4103738', '4102730', '4082554', '4103600', '4104588', '4104977', '4085633', '4103922', '4062798', '4071470', '4078679', '4085524', '4082548', '4103733', '4084942', '4103745', '4081924', '4104730', '4071336', '4103782', '4103903', '4080755', '4103513', '4102137', '4082544', '4102126', '4085797', '4090211', '4104419', '4082321', '4082319', '4071695', '4082604', '4083730', '4102967', '4105025', '4083277', '4079783', '4093085', '4093020', '4093196', '4068049', '4093201', '4093301', '4079906', '4075389', '4064305', '4083865', '4080746', '4096503', '4080438', '4068925', '4085941', '4085177', '4102109', '4102716', '4082490', '4073697', '4073316', '4083318', '4073440', '4083708', '4082523', '4071475', '4064289', '4083152', '4085984', '4082553', '4085986', '4085993', '4104010', '4105013', '4073692', '4085288', '4085002', '4085828', '4073562', '4082975', '4081038', '4080301', '4102743', '4082280', '4080019', '4067730', '4102130', '4080885', '4082677', '4084630', '4096554', '4082204', '4080249', '4080525', '4083335', '4080030', '4082816', '4101327', '4084803', '4083054', '4042489', '4081603', '4082525', '4082408', '4082281', '4083731', '4081997', '4081985', '4084726', '4084715', '4085740', '4084773', '4104329', '4080263', '4081234', '4083352', '4095298', '4082415', '4080321', '4080271', '4082963', '4084725', '4082624', '4085342', '4086015', '4083066', '4084361', '4093088', '4082108', '4082016', '4085640', '4064632', '4083706', '4075384', '4067721', '4086379', '4068345', '4082357', '4084713', '4084765', '4081462', '4089875', '4084453', '4074908', '4081243', '4084717', '4093103', '4082442', '4095350', '4082360', '4086505', '4082362', '4089881', '4083896', '4062929', '4081000', '4102964', '4096275', '4080335', '4092579', '4080967', '4062877', '4092583', '4095286', '4096424', '4068653', '4095178', '4096118', '4095168', '4078363', '4062819', '4068346', '4081930', '4096430', '4085852', '4071946', '4084174', '4082980', '4080475', '4082735', '4081074', '4084185', '4095933', '4083131', '4086436', '4104924', '4082741', '4071952', '4085360', '4082323', '4086423', '4085747', '4103979', '4096256', '4082147', '4096504', '4084351', '4079910', '4084322', '4081270', '4083272', '4080531', '4411286', '4080855', '4023301', '4085537', '4073267', '4086404', '4096261', '4081544', '4095330', '4095169', '4075396', '4074375', '4071650', '4071911', '4090139', '4071323', '4064283', '4068932', '4084289', '4085756', '4083338', '4082425', '4063991', '4082364'];
            let obj_ids = ids.map(function(id) { return id; });
            let devices = await Packing.find({'tag.code': {$in: obj_ids}}, {_id: 0, tag: 1}).skip(skip).limit(skip)
            //

            //let devices = await Packing.find({}, {_id: 0, tag: 1}).skip(skip).limit(skip)

            if(devices === null || devices.length === 0) {
                break;
            }
            let device_data_promises = devices.map(async packing => {
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
                
            })
    
            //esse for existe dessa maneira somente para garantir que cada promessa do array de promessas de devices seja finalizado (resolvido ou rejeitado) 
            for await (const device_data_promise of device_data_promises) {
                
            }

            skip=skip+jump;
            debug("Logout")

            await dm_controller.logoutDM(cookie)

            debug("Sleep inicio -")
            await promise_wait_seconds(sleepTime)
            debug("Sleep fim -")
            sleepped+=sleepTime
        }
        
        // debug(devices)


        let timeFinish = new Date().getTime();
        let timeTotal = timeFinish-timeInit

        
        results.result1 = `Devices que deram certo:  ${concluded_devices}`

        results.result2 = `Devices que deram errado:  ${error_devices}`

        results.result3 = `Job LOKA encerrado em ${new Date().toISOString()} com sucesso!`

        debug('Tempo de sleep (sec): '+sleepped)

        debug('Tempo total de execução (sec): '+timeTotal/1000)

        return Promise.resolve(results)

    } catch (error) {

        return Promise.reject(`Job LOKA encerrado em ${new Date().toISOString()} com erro | `+ error)
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