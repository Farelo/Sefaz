const HttpStatus = require('http-status-codes')

module.exports = (req, res, next) => {
    // 401 Unauthorized
    // 403 Forbidden
    if (!['masterAdmin', 'admin'].includes(req.authenticated.role)) return res.status(HttpStatus.FORBIDDEN).send('Permission denied.')
    next()
}