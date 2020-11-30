const debug = require('debug')('controller:companies')
const HttpStatus = require('http-status-codes')
const companies_service = require('./companies.service')
const logs_controller = require('../logs/logs.controller')

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
    
    logs_controller.create({token:req.headers.authorization, log:'create_company', newData:req.body});
    res.status(HttpStatus.CREATED).send(company)
}

exports.create_many = async (req, res) => {
    let companies = []

    for (let company of req.body) {
        current_company = await companies_service.create_company(company.data)
        companies.push(current_company);
        logs_controller.create({token:req.headers.authorization, log:'create_company_many', newData:company.data});
    }

    res.status(HttpStatus.CREATED).send(companies)
}

exports.update = async(req, res) => {
    let company = await companies_service.find_by_id(req.params.id)
    if (!company) return res.status(HttpStatus.NOT_FOUND).send('Invalid company')

    company = await companies_service.update_company(req.params.id, req.body)
    logs_controller.create({token:req.headers.authorization, log:'update_company', newData:req.body});
    res.json(company)
}

exports.delete = async (req, res) => {
    const company = await companies_service.find_by_id(req.params.id)
    if (!company) res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid company' })

    logs_controller.create({token:req.headers.authorization, log:'delete_company', newData:req.params.id});
    await company.remove()

    res.send({ message: 'Delete successfully'})
}