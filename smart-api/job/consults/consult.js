
'use strict';

const schemas    = require('../../config/database/require_schemas')

module.exports = function () {
  return [
    schemas.packing().find({})
      .populate('tag')
      .populate('actual_plant.plant')
      .populate('department')
      .populate('supplier')
      .populate('routes')
      .populate('project')
      .populate('gc16'), 
      schemas.plant().find({}).populate('logistic_operator'), 
      schemas.settings().findOne({_id: 1})
    ];
}
