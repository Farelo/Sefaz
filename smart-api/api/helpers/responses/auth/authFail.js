"use strict";

const HTTPStatus = require("http-status");

function authFail(res, err) {
  
  res.status(HTTPStatus.UNAUTHORIZED).json({jsonapi: { "version": "1.0" }, UNAUTHORIZED: 'The credentials are invalid!' });
}

module.exports = authFail;
