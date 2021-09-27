const debug = require('debug')('initial-load')
const fs = require('fs')
const dm_controller = require('../loka-integration/dm.controller')
const { Rack } = require('../../models/racks.model')
const { device_data_save } = require('../../models/device_data.model')
const appRoot = require('app-root-path');

module.exports = async () => {
    console.log('\nIniciando a carga inicial de device_data dos devices.\n')

    let job_started_at = new Date()

    const start_date_search = (new Date(null)).toLocaleString()
    
    let res;

    let data = ''
    let path = `${appRoot}/src/logs/`
    let file = `initial-load.log`
    let full_path = path + file
    let total_device_data = 0

    //TODO: tirar a criação da pasta de log daqui e colocar num local mais raiz para servir tambem para o modo produção, e nao somente a carga inicial
    if(!fs.existsSync(path))
        fs.mkdirSync(path)

    if (fs.existsSync(full_path))
        fs.unlinkSync(full_path)

    try {
        let cookie = await dm_controller.loginDM()
        
        let devices = await get_devices()

        console.log('devices: ', devices)

        while (devices.length /* || rodou inteiro pela quinta vez e nao acabou */) {
            
            device_to_search = devices.pop()

            res = await get_device_data_at_loka_and_save(device_to_search.tag.code, start_date_search, cookie)

            //se deu erro
            if (!res[0]) {
                //insere o device novamente, no final da lista
                devices.unshift(device_to_search)
            }
            else {
                total_device_data += res[1]
    
                data = `Device_data do device ${device_to_search.tag.code} carregado com sucesso e totalizando ${res[1]} registros. Restam ainda ${devices.length} devices a serem carregados.\n`
                
                console.log(path)
                console.log(data)
    
                fs.appendFileSync(full_path, data, {encoding: 'utf8', flag: 'a'})
            }

        }
        
        fs.appendFileSync(full_path, `Carga inicial Encerrada totalizando ${total_device_data} registros de device_data.\n`, {encoding: 'utf8', flag: 'a'})
        
        fs.appendFileSync(full_path, `Job iniciou em ${job_started_at} e encerrou em ${new Date()}.\n`, {encoding: 'utf8', flag: 'a'})

        await dm_controller.logoutDM(cookie)

        console.log('\nEncerrada a carga inicial de device_data dos devices.\n')

        process.exit()

    } catch (error) {
        
    }
}

const get_devices = async () => {
    
    try {
        const racks = await Rack.find({}, {_id: 0, tag: 1})//.limit(1)
    
        return racks//racks.lengh ? racks.map(rack => {return rack.tag.code}) : racks
        
    } catch (error) {
        
        console.log(`Erro ao buscar os racks no banco`)

        return []
    }

}

const get_device_data_at_loka_and_save = async (device_id, start_date_search, cookie) => {

        try {
            
            await dm_controller.confirmDevice(device_id, cookie)
    
            console.log(`Confirmado device ${device_id}`)

            const device_data_array = await dm_controller.getDeviceDataFromMiddleware(device_id, start_date_search, (new Date()).toLocaleString(), null, cookie)

            console.log(`Retornado os dados do device ${device_id}`)

            if(device_data_array) {
                await device_data_save(device_data_array)
            }
    
            console.log(`Sucesso ao gravar a carga inicial do device ${device_id}`)
    
            return [true, device_data_array.length]
    
        } catch (error) {
            console.log(`Erro ocorrido na carga inicial do device ${device_id}`)
    
            return [false, 0]
        }
}