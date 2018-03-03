'use strict';

const schemas = require('../config/database/require_schemas')

module.exports = function (devices) {
  var arrayOfPromises = [];

  devices.forEach(o => arrayOfPromises.push(schemas.packing().update(
    {code_tag: o.id}, o)));

  return arrayOfPromises;
}
