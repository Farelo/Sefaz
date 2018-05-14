'use strict';

const schemas        = require("../../api/schemas/require_schemas")
const alerts_type    = require('./alerts_type');

module.exports = function(p, settings) {
  return new Promise(function(resolve, reject) {
    if (p.battery < settings.battery_level) {
      //EMITIR ALERTA
      schemas.alert.find({ //Verifica se o alerta ja existe
        "packing": p._id,
        "status": alerts_type.BATTERY
      }).then(result => {
        if (result.length === 0) { //Caso o alerta não exista, simplestemente cria o alerta
          console.log("BATTERY: ALERT CREATE TO PACKING:",p._id);
          schemas.alert.create({
            "actual_plant": p.actual_plant,
            "department": p.department,
            "packing": p._id,
            "supplier": p.supplier,
            "project": p.project,
            "status": alerts_type.BATTERY,
            "hashpacking": p.hashPacking,
            "serial": p.serial,
            "date": new Date().getTime()
          }).then(() => resolve(p));
        } else {
          console.log("BATTERY: ALERT ALREADY EXIST TO PACKING:",p._id);
          schemas.alert.update({ //Verifica se o alerta ja existe
            "packing": p._id,
            "status": alerts_type.BATTERY
          },{
            "department": p.department,
            "actual_plant": p.actual_plant,
            "supplier": p.supplier,
            "project": p.project,
            "hashpacking": p.hashPacking,
            "serial": p.serial
          }).then(() => resolve(p));
        }
      });
    } else {
      //remove qualquer alerta de bateria referente a essa embalagem
      console.log("BATTERY: NO CONFORMIDADE ABOUT THE PACKING:",p._id);
      schemas.alert.remove({
        "packing": p._id,
        "status": alerts_type.BATTERY
      }).then(() => resolve(p));
    }
  });
}
