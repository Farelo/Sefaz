"use strict";

const HTTPStatus   = require("http-status");
const query        = require('../queries/complex_queries_packing');
const mongoose     = require('mongoose');
const packing      = mongoose.model('Packing');


function onSuccess(res, code, page, limit, err, data, pages, amount) {

  let total = data.reduce(function(previousValue, currentValue) {
    return {
      quantity: (previousValue.quantity + currentValue.quantity)
    };
  }, {
    quantity: 0
  }).quantity;

  let missing = data.reduce(function(previousValue, currentValue) {
    if (currentValue.missing) {
      return {
        quantity: (previousValue.quantity + currentValue.quantity)
      };
    } else {
      return previousValue;
    }
  }, {
    quantity: 0
  }).quantity;

  res.status(HTTPStatus.OK).json({
    jsonapi: {
      "version": "1.0"
    },
    meta: {
      "limit": limit,
      "page": page,
      "total_pages": pages,
      "total_docs": amount,
      "total_packings": total,
      missing: missing
    },
    data: data
  });
}

module.exports = onSuccess;
