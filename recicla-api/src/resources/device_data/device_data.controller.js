const debug = require('debug')('controller:device_data')
const HttpStatus = require('http-status-codes')
const device_data_service = require('./device_data.service')

exports.all = async (req, res) => {
    const device_id = req.params.device_id
    const query = {
        start_date: req.query.start_date ? req.query.start_date : null,
        end_date: req.query.end_date ? req.query.end_date : null,
        accuracy: req.query.accuracy ? req.query.accuracy : 32000
    }
    
    const packing = await device_data_service.find_packing_by_device_id(device_id)
    if (!packing) return res.status(HttpStatus.NOT_FOUND).send({ message: 'Invalid device id.' })

    const device_data = await device_data_service.get_device_data(device_id, query)

    res.json(device_data)
}

// exports.create = async(req, res) => {
//     const device_data = await device_data_services.create_device_data(req.body)
//     res.status(HttpStatus.CREATED).send(device_data)
// }