'use strict';

const schemas = require('../config/database/require_schemas')
const types = require('./historic_type')


module.exports = {
  create: function(p) {
    return schemas.historicPackings().create({
      "actual_gc16":  p.actual_gc16,
      "plant": p.actual_plant,
      "department": p.department,
      "date": p.permanence.date,
      "temperature": p.temperature,
      "permanence_time": p.permanence.amount_days,
      "serial": p.serial,
      "supplier": p.supplier,
      "packing": p._id,
      "packing_code": p.code,
      "status": types.NORMAL
    });
  },
  create_from_alert: function (p, status, date, time) {
    return schemas.historicPackings().create({
      "actual_gc16":  p.actual_gc16,
      "date": date,
      "temperature": p.temperature,
      "permanence_time": time,
      "serial": p.serial,
      "supplier": p.supplier,
      "packing": p._id,
      "packing_code": p.code,
      "status": status
    });
  },
  update: function(p) {
    return new Promise(function(resolve, reject) {
      if (!p.missing) {

        schemas.historicPackings().update({
            "packing": p._id,
            "date": p.permanence.date
          }, {
            "actual_gc16":  p.actual_gc16 ,
            "department": p.department  ,
            "plant": p.actual_plant,
            "date": p.permanence.date,
            "temperature": p.temperature,
            "permanence_time": p.permanence.amount_days,
            "serial": p.serial,
            "supplier": p.supplier,
            "packing": p._id,
            "packing_code": p.code,
            "status": types.NORMAL
          }).then(() => resolve("OK"));

      } else {
        resolve("OK");
      }
    });
  },
  update_from_alert: function(p, status, date, time) {
    return new Promise(function(resolve, reject) {
     
        schemas.historicPackings().update({
            "packing": p._id,
          "date": date
          }, {
            "date": date,
            "temperature": p.temperature,
            "permanence_time": time,
            "serial": p.serial,
            "supplier": p.supplier,
            "packing": p._id,
            "packing_code": p.code,
            "status": status
          }).then(() => resolve("OK"));
    });
  }
}
