const debug = require('debug')('controller:companies')
const _ = require('lodash')
const HttpStatus = require('http-status-codes')
const { Company } = require('./companies.model')

exports.all = async (req, res) => {
    const companies = await Company.find().populate('users', ['_id', 'email', 'role'])

    res.json(companies)
}

exports.show = async (req, res) => {
    const company = await Company
        .findById(req.params.id)
        .populate('users', ['_id', 'email', 'role'])

    if (!company) return res.status(HttpStatus.NOT_FOUND).send('Invalid company')

    res.json(company)
}

exports.create = async (req, res) => {
    company = new Company((req.body))
    await company.save()

    res.send(company)
}

exports.update = async(req, res) => {
    let company = await Company.findById(req.params.id)
    if (!company) return res.status(HttpStatus.NOT_FOUND).send('Invalid company')

    const options = { runValidators: true, new: true}

    company = await Company.findByIdAndUpdate(req.params.id, req.body, options)

    res.json(company)
}

exports.delete = async (req, res) => {
    const company = await Company.findById(req.params.id).populate('users')
    if (!company) res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid company' })

    await company.remove()

    res.send({ message: 'Delete successfully'})
}