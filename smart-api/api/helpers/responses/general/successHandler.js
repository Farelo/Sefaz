"use strict";

const HTTPStatus = require("http-status");

function onSuccess(res, refresh_token, data) {
  res.status(HTTPStatus.OK).json({ jsonapi: { "version": "1.0" }, "refresh_token": refresh_token, status: HTTPStatus.OK , data: data });
}

module.exports = onSuccess;
