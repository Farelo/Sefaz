const debug = require('debug')('service:device_data')
// const _ = require('lodash')
const { DeviceData } = require('./device_data.model')

exports.get_device_data = async(deviceId, startDate, endDate, max) => {

    try {
        let conditions = {}
        let options = {}

        conditions.device_id = deviceId

        /*
            Quando houver duas datas de busca: buscara as mensagens pertencentes ao intervalo definido
            Quando houver apenas uma data de busca: a outra data será o padrão de início ou fim: 01/01/1900 para o inicio ou a data e hora atual para o fim
            Quando não houver nenhuma data passada, então não criará o filtro por intervalo de datas
         */
        if (startDate || endDate) {

            // new Date().toISOString para garantir que a data passada será deslocada para a time zone padrão GMT
            //o mongoDB ao gravar as datas passadas, ele automaticamente as desloca para o GMT 
            startDate = (startDate ===  undefined || startDate ===  null)  ? new Date('1970-01-01'): (new Date(startDate)).toISOString() 
            endDate   = (endDate   ===  undefined || endDate ===  null) ? (new Date()).toISOString() : (new Date(endDate)).toISOString()

            conditions.message_date = { $gte: new Date(startDate), $lte: new Date(endDate)}
        }

        //ordena por message_date decrescente
        options.sort = {message_date: -1}

        //limita a quantidade de mensagens a serem retornadas 
        if (max)
            options.limit = parseInt(max)

        let device_data = await DeviceData.find(conditions, null, (max === undefined || max === null) ? null : options )

        return device_data

    } catch (error) {
        throw new Error(error)
    }
}

exports.create_device_data = async(device_data) => {
    try {
        const new_device_data = new DeviceData(device_data)
        await new_device_data.save()

        return new_device_data
    } catch (error) {
        throw new Error(error)
    }

}

exports.find_by_id = async (id) => {
    try {
        const device_data = await DeviceData.findById(id)
        return device_data
    } catch (error) {
        throw new Error(error)
    }
}

exports.update_device_data = async(id, device_data_edited) => {

    try {
        let options = { runValidators: true, new: true }
        let device_data = await DeviceData.findByIdAndUpdate(id, device_data_edited, options)

        return device_data
    } catch (error) {
        throw new Error(eror)
    }

}
//busca ultima bateria por deviceId
//busca ultima bateriatemperatura por deviceId
//busca ultima posicao