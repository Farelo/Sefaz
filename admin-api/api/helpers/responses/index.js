'use strict';

const successHandler                                = require('./general/successHandler');
const errorHandler                                  = require('./general/errorHandler');
const successHandlerPagination                      = require('./pagination/successHandlerPagination');
const authSuccess                                   = require('./auth/authSuccess');
const authFail                                      = require('./auth/authFail');

/*
* modulos que serão exportados para o sistema
*/
module.exports = {
    successHandler: successHandler,
    successHandlerPagination: successHandlerPagination,
    errorHandler: errorHandler,
    authSuccess: authSuccess,
    authFail: authFail
}
