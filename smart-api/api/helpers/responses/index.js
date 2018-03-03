'use strict';

const successHandler                                = require('./general/successHandler');
const errorHandler                                  = require('./general/errorHandler');
const successHandlerPagination                      = require('./pagination/successHandlerPagination');
const successHandlerPaginationAggregate             = require('./aggregate/successHandlerPaginationAggregate');
const successHandlerPaginationAggregateQuantity     = require('./aggregate/successHandlerPaginationAggregateQuantity');
const authSuccess                                   = require('./auth/authSuccess');
const authFail                                      = require('./auth/authFail');

/*
* modulos que serão exportados para o sistema 
*/
module.exports = {
    successHandler: successHandler, 
    successHandlerPagination: successHandlerPagination, 
    successHandlerPaginationAggregate: successHandlerPaginationAggregate, 
    successHandlerPaginationAggregateQuantity: successHandlerPaginationAggregateQuantity, 
    errorHandler: errorHandler, 
    authSuccess: authSuccess,
    authFail: authFail
}



