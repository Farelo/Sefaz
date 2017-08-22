"use strict";

const HTTPStatus   = require("http-status");
const query        = require('../queries/complex_queries_packing');
const mongoose     = require('mongoose');
const packing      = mongoose.model('Packing');


function onSuccess(res, code, err, data, page, amount) {
  packing.aggregate(query.queries.quantity_total(code))
        .then(result => res.status(HTTPStatus.OK).json({ jsonapi: { "version": "1.0" },
        meta: {"page": page , "total_docs": amount, "total_packings": 0, missing: 0 } ,
        data: data }));
}

module.exports = onSuccess;
