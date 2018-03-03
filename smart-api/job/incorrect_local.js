'use strict';

const schemas         = require('../config/database/require_schemas')
const evaluate_route  = require('./evaluate_route');
const alerts_type     = require('./alerts_type');

module.exports = function(p, plant) {
  return new Promise(function(resolve, reject) {
    if(evaluate_route(p, plant)){ //Make sure the current plant belongs to the route
      p.problem = false;
      console.log("INCORRECT LOCAL: NO CONFORMIDADE ABOUT THE PACKING:",p._id);
      schemas.alert().remove({
        "packing": p._id,
        "status": alerts_type.INCORRECT_LOCAL
      }).then(() => resolve(p));
    }else{
        p.problem = true;
      schemas.alert().find({ //Verifica se o alerta ja existe
          "packing": p._id,
          "status": alerts_type.INCORRECT_LOCAL
        }).then(result => {
          if (result.length === 0) { //Caso o alerta não exista, simplestemente cria o alerta
            console.log("INCORRECT LOCAL: ALERT CREATE TO PACKING:",p._id);
            schemas.alert().create({
              "department": p.department,
              "routes": p.routes,
              "actual_plant": p.actual_plant,
              "packing": p._id,
              "project": p.project,
              "supplier": p.supplier,
              "status": alerts_type.INCORRECT_LOCAL,
              "hashpacking": p.hashPacking,
              "serial": p.serial,
              "date": new Date().getTime()
            }).then(() => resolve(p));
          } else {
            console.log("INCORRECT LOCAL: ALERT ALREADY EXIST TO PACKING:", p._id);
            schemas.alert().update({ //Verifica se o alerta ja existe
              "packing": p._id,
              "status": alerts_type.INCORRECT_LOCAL
            },{
              "department": p.department,
              "routes": p.routes,
              "project": p.project,
              "actual_plant":p.actual_plant,
              "supplier": p.supplier,
              "hashpacking": p.hashPacking,
              "serial": p.serial
            }).then(() => resolve(p));
          }
        });
    }
  });
}
