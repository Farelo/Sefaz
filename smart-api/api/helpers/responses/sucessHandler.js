"use strict";

var HTTPStatus = require("http-status");

function onSuccess(res, data) {
  res.status(HTTPStatus.OK).json({ jsonapi: { "version": "1.0" }, "data": data });
}

module.exports = onSuccess;
