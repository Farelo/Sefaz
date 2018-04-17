"use strict";

const HTTPStatus         = require("http-status");
const constants          = require('../../utils/constants')
const errorHandlerLoka   = require('../errors/errorHandlerLoka')
const errorHandlerMongo  = require('../errors/errorHandlerMongo')

//melhorar o handler de erro
function onError(res, message, err) {

    if (err === constants.lokaError){
        errorHandlerLoka(res, message, err);
    } else if (err.name === constants.mongoError){
        errorHandlerMongo(res, message, err);
    }
    
}

module.exports = onError
