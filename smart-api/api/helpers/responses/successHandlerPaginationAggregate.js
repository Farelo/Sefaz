"use strict";

const HTTPStatus = require("http-status");

function onSuccess(res, err, data, page, amount) {
  res.status(HTTPStatus.OK).json({ jsonapi: { "version": "1.0" }, meta: {"page": page , "total_docs": amount} , data: data });
}

module.exports = onSuccess;
