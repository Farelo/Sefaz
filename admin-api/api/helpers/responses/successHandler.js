"use strict";

const HTTPStatus = require("http-status");

function onSuccess(res, data) {
  res.status(HTTPStatus.OK).json({ jsonapi: { "version": "1.0" }, status: HTTPStatus.OK , data: data });
}

module.exports = onSuccess;
