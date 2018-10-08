module.exports = (req, res, next) => {
    // 401 Unauthorized
    // 403 Forbidden
    if (!req.authenticated.role === 'admin') return res.status(403).send('Permission denied.')
    next()
}