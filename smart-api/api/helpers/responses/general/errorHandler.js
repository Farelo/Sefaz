"use strict";

const HTTPStatus = require("http-status");

function onError(res, message, err) {

    res.status(HTTPStatus.BAD_REQUEST).send({
        jsonapi: { "version": "1.0" },
        error: {
            "name": err ? err.name : "Undefined" ,
            "message": err ? err.message : "Undefined",
            "error": err ? err.errors : "Undefined",
            "detail": message
        }
    });
}

module.exports = onError;
