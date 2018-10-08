const debug = require('debug')('controller:users')
const _ = require('lodash')
const { User } = require('./users.model')
const { Company } = require('../companies/companies.model')
const users_service = require('./users.service')

exports.sign_in = async (req, res) => {
    let user = await User.findByEmail(req.body.email)
    if (!user) return res.status(400).send('Invalid email or password')

    const valid_password = await user.passwordMatches(req.body.password)
    if (!valid_password) return res.status(400).send('Invalid password')

    const token = user.generateUserToken()
    res.send({ email: user.email, accessToken: token })
}

exports.all = async (req, res) => {
    const users = await users_service.findUsers()

    res.json(users)
}

exports.show = async (req, res) => {
    const user = await users_service.findUser(req.params.id)
    if (!user) return res.status(404).send('Invalid user')

    res.json(user)
}

exports.create = async (req, res) => {
    let user = await User.findByEmail(req.body.email)
    if (user) return res.status(400).send('User already registered.')   

    const company = await Company.findById(req.body.company)
    if (!company) return res.status(400).send('Invalid company')

    user = new User({
        email: req.body.email,
        password: req.body.password,
        company: company
    })

    company.users.push(user._id)

    await user.save()
    await company.save()

    const token = user.generateUserToken()
    res.header('Authorization', token)
        .send(_.pick(user, ['_id', 'email']))
}

exports.update = async (req, res) => {
    let user = await User.findById(req.params.id)
    if (!user) return res.status(404).send('Invalid user')

    const options = { runValidators: true, new: true }

    user = await User.findByIdAndUpdate(req.params.id, req.body, options)

    res.json(_.pick(user, ['_id', 'email']))
}

exports.delete = async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) res.status(400).send({ message: 'Invalid user' })

    await user.remove()

    res.json({ message: 'Delete successfully' })
}