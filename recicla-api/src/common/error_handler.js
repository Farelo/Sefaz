const logger = require('../config/winston.config')

function ErrorHandler(http_code, title, details, is_operational) {
    Error.call(this)
    Error.captureStackTrace(this)
    this.http_code = http_code
    this.title = title
    this.details = details
    this.is_operational = is_operational
}

ErrorHandler.prototype = Error.prototype

exports.ErrorHandler = ErrorHandler
