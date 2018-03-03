'use strict';

const schemas = require('../config/database/require_schemas')

module.exports = {
  set: function(p){
    return schemas.packing().update({"_id": p._id},p);
  },
  unset: function(p){
    return schemas.packing().update({"_id": p._id},{$unset: {'actual_plant': 1, 'department':1}});
  }
}
