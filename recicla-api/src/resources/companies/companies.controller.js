const debug = require('debug')('controller:companies')
const HttpStatus = require('http-status-codes')
const companies_service = require('./companies.service')

exports.all = async (req, res) => {
    const companies = await companies_service.get_companies()

    res.json(companies)
}

exports.show = async (req, res) => {
    const company = await companies_service.get_company(req.params.id)
    if (!company) return res.status(HttpStatus.NOT_FOUND).send('Invalid company')

    res.json(company)
}

exports.create = async (req, res) => {
    const company = await companies_service.create_company(req.body)
    res.status(HttpStatus.CREATED).send(company)
}

exports.update = async(req, res) => {
    let company = await companies_service.find_by_id(req.params.id)
    if (!company) return res.status(HttpStatus.NOT_FOUND).send('Invalid company')

    company = await companies_service.update_company(req.params.id, req.body)

    res.json(company)
}

exports.delete = async (req, res) => {
    const company = await companies_service.find_by_id(req.params.id)
    if (!company) res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid company' })

    await company.remove()

    res.send({ message: 'Delete successfully'})
}