const debug = require('debug')('controller:companies')
const _ = require('lodash')
const { Company } = require('./companies.model')
const { User } = require('../users/users.model')

exports.all = async (req, res) => {
    const companies = await Company.find().populate('users', ['_id', 'email', 'role'])

    res.json(companies)
}

exports.show = async (req, res) => {
    const company = await Company.findById(req.params.id).populate('users', ['_id', 'email', 'role'])
    if (!company) return res.status(404).send('Invalid company')

    res.json(company)
}

exports.create = async (req, res) => {
    company = new Company(_.pick(req.body, ['name']))
    await company.save()

    res.send(_.pick(company, ['_id', 'name']))
}

exports.update = async(req, res) => {
    let company = await Company.findById(req.params.id)
    if (!company) return res.status(404).send('Invalid company')

    const options = { runValidators: true, new: true}

    company = await Company.findByIdAndUpdate(req.params.id, req.body, options)

    res.json(company)
}

exports.delete = async (req, res) => {
    const company = await Company.findById(req.params.id).populate('users')
    if (!company) res.status(400).send({ message: 'Invalid company' })

    await company.remove()

    res.send({ message: 'Delete successfully'})
}