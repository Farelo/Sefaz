"use strict";

const HTTPStatus = require("http-status");

function onSuccess(res, refresh_token,  data) {
  res.status(HTTPStatus.OK).json({ jsonapi: { "version": "1.0" }, "refresh_token": refresh_token, meta: {"limit": data.limit,"page": data.page , "total_pages": data.pages, "total_docs": data.total} , data: data.docs, });
}

module.exports = onSuccess;
