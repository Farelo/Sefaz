const debug = require('debug')('service:users')
const { User } = require('./users.model')

exports.login = async (req, res) => {
    let user = await User.findByEmail(req.body.email)
    if (!user) return res.status(400).send('Invalid email or password')

    const valid_password = await user.passwordMatches(req.body.password)
    if (!valid_password) return res.status(400).send('Invalid password')

    const token = user.generateUserToken()

    return { user, token }
}

exports.get_users = async () => {
    try {
        const users = await User
            .find()
            .select('-password')
            .populate('company')

        return users
    } catch (error) {
        throw new Error(error)
    }
}

exports.get_user = async (res, id) => {
    try {
        const user = await User
            .findById(id)
            .select('-password')
            .populate('company')

        if (!user) return res.status(404).send('Invalid user')
        return user
    } catch (error) {
        throw new Error(error)
    }
}