'use strict';

const xlsxtojson                 = require("xlsx-to-json-lc");
const successHandler             = require('../helpers/responses/successHandler');
const errorHandler               = require('../helpers/responses/errorHandler');
const fs                         = require('fs');
const _                          = require("lodash");

exports.uploads = function(req, res) {

  var datetimestamp = Date.now();
  fs.writeFile("./uploads/"+datetimestamp+req.swagger.params.upfile.value.originalname, req.swagger.params.upfile.value.buffer, function (err,data) {

    xlsxtojson({
      input: "./uploads/"+datetimestamp+req.swagger.params.upfile.value.originalname, //the same path where we uploaded our file
      output: null, //since we don't need output.json
      lowerCaseHeaders: true
    }, function(err, result) {
      fs.unlinkSync("./uploads/"+datetimestamp+req.swagger.params.upfile.value.originalname);
      if (err) {
        errorHandler(res, 'Error to create packing', err);
      }
      successHandler(res, result);
    });
  });
};
