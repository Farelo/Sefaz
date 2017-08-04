"use strict";

const HTTPStatus = require("http-status");

function onSuccess(res, data) {
  res.status(HTTPStatus.OK).json({ jsonapi: { "version": "1.0" }, meta: {"limit": data.limit,"page": data.page , "total_pages": data.pages, "total_docs": data.total} , data: data.docs, });
}

module.exports = onSuccess;
