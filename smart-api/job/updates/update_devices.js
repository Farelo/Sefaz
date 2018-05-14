'use strict';

const schemas = require("../../api/schemas/require_schemas")

module.exports = function (devices) {
  let arrayOfPromises = [];

  devices.forEach(o => arrayOfPromises.push(schemas.packing.update(
    {code_tag: o.id}, o)));

  return arrayOfPromises;
}
