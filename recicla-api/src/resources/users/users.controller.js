const debug = require('debug')('controller:users')
const _ = require('lodash')
const HttpStatus = require('http-status-codes')
const { User } = require('./users.model')
const { Company } = require('../companies/companies.model')

exports.sign_in = async (req, res) => {
    let user = await User.findByEmail(req.body.email)
    if (!user) return res.status(HttpStatus.BAD_REQUEST).send('Invalid email or password')

    const valid_password = await user.passwordMatches(req.body.password)
    if (!valid_password) return res.status(HttpStatus.BAD_REQUEST).send('Invalid password')

    const token = user.generateUserToken()
    // const { user, token } = await users_service.login(req, res)
    res.send({ _id: user._id, full_name: user.full_name, email: user.email, role: user.role, company: user.company, accessToken: token })
}

exports.all = async (req, res) => {
    const users = await User
        .find()
        .select('-password')
        .populate('company')

    res.json(users)
}

exports.show = async (req, res) => {
    const user = await User
        .findById(req.params.id)
        .select('-password')
        .populate('company')

    if (!user) return res.status(HttpStatus.NOT_FOUND).send('Invalid user')

    res.json(user)
}

exports.create = async (req, res) => {
    let user = await User.findByEmail(req.body.email)
    if (user) return res.status(HttpStatus.BAD_REQUEST).send('User already registered.')   

    const company = await Company.findById(req.body.company)
    if (!company) return res.status(HttpStatus.BAD_REQUEST).send('Invalid company')

    user = new User(req.body)

    // company.users.push(user._id)

    await user.save()
    // await company.save()

    // const token = user.generateUserToken()
    res.status(HttpStatus.CREATED).json(_.pick(user, ['_id', 'full_name', 'email', 'role', 'company']))
}

exports.update = async (req, res) => {
    let user = await User.findById(req.params.id)
    if (!user) return res.status(HttpStatus.NOT_FOUND).send('Invalid user')

    const options = { new: true }
    user = await User.findByIdAndUpdate(req.params.id, req.body, options)

    res.json(_.pick(user, ['_id', 'full_name', 'email', 'role', 'company']))
}

exports.delete = async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid user' })

    await user.remove()

    res.json({ message: 'Delete successfully' })
}