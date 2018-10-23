const debug = require('debug')('controller:users')
const _ = require('lodash')
const HttpStatus = require('http-status-codes')
const { User } = require('./users.model')
const { Company } = require('../companies/companies.model')
const users_service = require('./users.service')

exports.sign_in = async (req, res) => {
    let user = await users_service.find_by_email(req.body.email)
    if (!user) return res.status(HttpStatus.BAD_REQUEST).send('Invalid email or password')

    const valid_password = await user.passwordMatches(req.body.password)
    if (!valid_password) return res.status(HttpStatus.BAD_REQUEST).send('Invalid password')

    const token = user.generateUserToken()
    res.send({ _id: user._id, full_name: user.full_name, email: user.email, role: user.role, company: user.company, accessToken: token })
}

exports.all = async (req, res) => {
    const users = await users_service.get_users()
    res.json(users)
}

exports.show = async (req, res) => {
    const user = await users_service.get_user(req.params.id)
    if (!user) return res.status(HttpStatus.NOT_FOUND).send('Invalid user')

    res.json(user)
}

exports.create = async (req, res) => {
    let user = await users_service.find_by_email(req.body.email)
    if (user) return res.status(HttpStatus.BAD_REQUEST).send('User already registered.')   

    const company = await users_service.find_company_by_id(req.body.company)
    if (!company) return res.status(HttpStatus.BAD_REQUEST).send('Invalid company')

    user = await users_service.create_user(req.body)

    res.status(HttpStatus.CREATED).json(_.pick(user, ['_id', 'full_name', 'email', 'role', 'company']))
}

exports.update = async (req, res) => {
    let user = await users_service.find_by_id(req.params.id)
    if (!user) return res.status(HttpStatus.NOT_FOUND).send('Invalid user')

    user = await users_service.update_user(req.params.id, req.body)

    res.json(_.pick(user, ['_id', 'full_name', 'email', 'role', 'company']))
}

exports.delete = async (req, res) => {
    const user = await users_service.find_by_id(req.params.id)
    if (!user) res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid user' })

    await user.remove()

    res.json({ message: 'Delete successfully' })
}