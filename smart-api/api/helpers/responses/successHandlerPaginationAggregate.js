"use strict";

const HTTPStatus = require("http-status");

function onSuccess(res, page, limit, err, data, pages, amount) {
  res.status(HTTPStatus.OK).json({ jsonapi: { "version": "1.0" }, meta:   {"limit": limit,"page": page , "total_pages": pages, "total_docs": amount} , data: data });
}

module.exports = onSuccess;
