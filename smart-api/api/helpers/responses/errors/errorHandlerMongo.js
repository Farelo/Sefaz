"use strict";

const HTTPStatus = require("http-status");

//melhorar o handler de erro
function onError(res, message, err) {

    
    res.status(HTTPStatus.BAD_REQUEST).send({
        jsonapi: { "version": "1.0" },
        "name": err ? err.name : "Undefined",
        "message": err ? err.message : "Undefined",
        "error": err ? err.errmsg : "Undefined",
        "detail": message
    })


}

module.exports = onError
