const debug = require('debug')('service:users')
const { User } = require('./users.model')

exports.findUsers = async () => {
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

exports.findUser = async (id) => {
    try {
        const user = await User.findById(id)
        // if (!user) return false
        return user
    } catch (error) {
        throw new Error(error)
    }
}