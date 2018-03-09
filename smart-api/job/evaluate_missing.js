'use strict';

const schemas           = require('../config/database/require_schemas')
const historic          = require('./historic');
const alerts_type       = require('./alerts_type');
const historic_types    = require('./historic_type')

module.exports = function(p) {
  return new Promise(function(resolve, reject) {

    if(p.missing){
      console.log("MISSING: ALERT ALREADY EXIST TO PACKING:",p._id);
      var date = new Date()
      var time = Math.floor(date.getTime()-p.packing_missing.date);

      p.packing_missing = {
        "date": p.packing_missing.date,
        "time_countdown": time
      };
      schemas.alert().update({ //Verifica se o alerta ja existe
        "packing": p._id,
        "status": alerts_type.MISSING
      }, {
        "department": p.last_department,
        "actual_plant": p.last_plant,
        "project": p.project,
        "supplier": p.supplier,
        "hashpacking": p.hashPacking,
        "serial": p.serial
      })
      .then(() => historic.update_from_alert(p, historic_types.MISSING, p.packing_missing.date, p.packing_missing.time_countdown))
      .then(() => resolve(p));
    }else{
      if(p.traveling){
        console.log("MISSING: NO CONFORMIDADE ABOUT THE PACKING:",p._id);
        resolve(p);
      }else{
        //CRIA O ALERTA
        console.log("MISSING: CREATE THE ALERT TO PACKING:",p._id);
        p.missing = true;
        p.packing_missing = {
          "date": new Date().getTime(),
          "time_countdown": 0,
        };
        p.last_plant = p.actual_plant;
        p.last_department = p.department;
        schemas.alert().create({
            "packing": p._id,
            "department": p.department,
            "actual_plant": p.last_plant,
            "supplier": p.supplier,
            "project": p.project,
            "status": alerts_type.MISSING,
            "hashpacking": p.hashPacking,
            "serial": p.serial,
            "date": new Date().getTime()
          })
        .then(() => schemas.alert().remove({"packing": p._id,"status": alerts_type.TRAVELING}))
        .then(() => historic.create_from_alert(p, historic_types.MISSING, p.packing_missing.date, p.packing_missing.time_countdown))
        .then(() => resolve(p));
      }
    }
  });
}
