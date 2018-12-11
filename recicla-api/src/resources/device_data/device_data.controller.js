const debug = require('debug')('controller:device_data')
const HttpStatus = require('http-status-codes')
const device_data_service = require('./device_data.service')
const families_service = require('../families/families.service')
const companies_service = require('../companies/companies.service')
const control_points_service = require('../control_points/control_points.service')

exports.all = async (req, res) => {
    const { device_id } = req.params
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

exports.geolocation = async(req, res) => {
    const query = {
        company_id: req.query.company_id ? req.query.company_id : null,
        family_id: req.query.family_id ? req.query.family_id : null,
        packing_serial: req.query.packing_serial ? req.query.packing_serial : null
    }

    if (req.query.family_id) {
        const family = await families_service.get_family(req.query.family_id)
        if (!family) return res.status(HttpStatus.NOT_FOUND).send('Invalid family')
    }

    if (req.query.company_id) {
        const company = await companies_service.get_company(req.query.company_id)
        if (!company) return res.status(HttpStatus.NOT_FOUND).send('Invalid company')
    }

    const device_data = await device_data_service.geolocation(query)

    res.json(device_data)
}

exports.packings_on_cp = async(req, res) => {
    const { control_point_id } = req.params

    const control_point = await control_points_service.get_control_point(control_point_id)
    if (!control_point) return res.status(HttpStatus.NOT_FOUND).send('Invalid company')

    const data = await device_data_service.packings_on_cp(control_point_id)

    res.json(data)
}

