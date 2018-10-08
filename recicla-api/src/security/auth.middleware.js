const jwt = require('jsonwebtoken')
const config = require('config');
const { User } = require('../resources/users/users.model')

module.exports = (req, res, next) => {
    // Authorization: Bearer TOKEN
    const token = extractToken(req)
    if (!token) return res.status(401).send('Access denied. No token provided.')

    try {
        // jwt.verify(token, config.get('Security.jwtPrivateKey'), applyBearer(req, res, next))
        const decoded_payload = jwt.verify(token, config.get('security.jwtPrivateKey'))
        req.authenticated = decoded_payload
        next()
    } catch (error) {
        res.status(400).send('Invalid token.')
    }
}

const extractToken = (req) => {
    // Authorization: Bearer TOKEN
    let token = undefined
    const authorization = req.header('Authorization')
    if (authorization) {
        const parts = authorization.split(' ')
        if(parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1]
        }
    }

    return token
}

