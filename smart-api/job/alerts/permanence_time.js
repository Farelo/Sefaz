'use strict';

const schemas       = require('../../config/database/require_schemas')
const alerts_type   = require('./alerts_type')

module.exports = {

  change: function(p, changeLocation) {
    console.log("CHANGE: PACKING: " + p._id);
    return new Promise(function(resolve, reject) {
      //remove qualquer alerta de permanencia referente a essa embalagem
    schemas.alert().remove({
        "packing": p._id,
        "status": alerts_type.PERMANENCE
      }).then(() => resolve(p));
    });
  },

  fixednoroute: function(p) {
    return new Promise(function(resolve, reject) {
      if (!p.missing) {


        var date = new Date();
        var diff = Math.round(date.getTime() - p.permanence.date);

        if(p.actual_gc16){
          var convertMili = 1000 * 60 * 60 * 24 * p.actual_gc16.days;// milliseconds*seconds*minutes*hours*days
        }else{
          var convertMili = Infinity;
        }


        p.permanence.amount_days = diff;
        p.permanence.time_exceeded = false;

        if(p.permanence.amount_days > convertMili){
          p.permanence.time_exceeded = true;
          schemas.alert().find({ //Verifica se o alerta ja existe
            "packing": p._id,
            "status": alerts_type.PERMANENCE
          }).then( result => {
            if(result.length === 0){ //Caso o alerta não exista, simplestemente cria o alerta
              console.log("PERMANENCE TIME: ALERT CREATE TO PACKING:",p._id);
              schemas.alert().create({
                "actual_plant": p.actual_plant,
                "department": p.department,
                "packing": p._id,
                "project": p.project,
                "supplier": p.supplier,
                "status": alerts_type.PERMANENCE,
                "hashpacking": p.hashPacking,
                "serial": p.serial,
                "date": new Date().getTime()
              }).then(() => resolve(p));
            }else{
              console.log("PERMANENCE TIME: ALERT ALREADY EXIST TO PACKING:",p._id);
              schemas.alert().update({ //Verifica se o alerta ja existe
                "packing": p._id,
                "status": alerts_type.PERMANENCE
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
        }else{
          console.log("PERMANENCE TIME: NO CONFORMIDADE ABOUT THE PACKING:",p._id);
          schemas.alert().remove({
            "packing": p._id,
            "status": alerts_type.PERMANENCE
          }).then(() => resolve(p));
        }
      } else {
        p.permanence = {
          "amount_days": 0,
          "date": 0,
          "time_exceeded": false
        };
        console.log("PERMANENCE TIME: NO CONFORMIDADE ABOUT THE PACKING:",p._id);
        schemas.alert().remove({
          "packing": p._id,
          "status": 5
        }).then(() => resolve(p));
      }
    });
  }
}
