const debug = require('debug')('controller:device_data')
const HttpStatus = require('http-status-codes')
const device_data_services = require('./device_data.service')

exports.all = async (req, res) => {

    const deviceId = req.params.deviceId
    const startDate = req.query.startDate ? req.query.startDate : null
    const endDate = req.query.endDate ? req.query.endDate : null
    const max = req.query.max ? req.query.max : null

    const device_data = await device_data_services.get_device_data(deviceId, startDate, endDate, max)

    res.json(device_data)
}

/*
    As funções abaixo não precisam existir agora porem serão úteis no futuro
    quando desenvolvermos o sistema admin dos sistemas clientes.

    Elas permitirão corrigir/deletar registros de device_data a partir do admin
*/

exports.create = async(req, res) => {

    //colocar o codigo: se ja houver device_data com o mesmo deviceId e message_date, entao nao deixa inserir

    let device_data = await device_data_services.create_device_data(req.body)

    res.status(HttpStatus.CREATED).send(device_data)

}

// exports.update = async (req, res) => {

//     let device_data = await device_data_services.find_by_id(req.params.id)
//     if (!device_data) return res.status(HttpStatus.NOT_FOUND).send({message: 'Invalid device_data'})

//     device_data = await device_data_services.update_device_data(req.params.id, req.body)

//     res.json(device_data)

// }

// exports.delete = async (req, res) => {

//     let device_data = await device_data_services.find_by_id(req.params.id)

//     if (!device_data) res.status(HttpStatus.BAD_REQUEST).send({message: 'Invalid device_data'})

//     await device_data.remove()

//     res.send({message: 'Delete successfully'})

// }