"use strict";

var HTTPStatus = require("http-status");

function onError(res, message, err) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send({
        jsonapi: { "version": "1.0" },
        error: {
            "status": err,
            "source": { "pointer": "" },
            "detail": message
        }
    });
}

module.exports = onError;
