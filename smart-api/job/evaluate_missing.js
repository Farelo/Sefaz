const mongoose   = require('mongoose');
const alert      = mongoose.model('Alerts');
const historic   = require('./historic');
mongoose.Promise = global.Promise;

module.exports = function(p) {
  return new Promise(function(resolve, reject) {
    var hourMili = 1000 * 60  ;  // milliseconds*seconds*minutes*hours
    var date = new Date()
    var transform = new Date(0);
    var time = Math.floor(date.getTime()-transform.setSeconds(p.lastCommunication));


    if (time > hourMili) { //sumiu mais do que 3 horas
      //emite alerta
      p.missing = true;
      p.packing_missing = {
        "last_time": p.lastCommunication,
        "time_countdown": time,
        "route": p.actual_plant
      };

      if(!p.traveling){ //verifica se esta viajando, caso esteja viajando espera so a mesma se identificada para poder atualizr as informações da embalagem
        alert.find({ //Verifica se o alerta ja existe
          "packing": p._id,
          "status": 1
        }).then(result => {
          if (result.length === 0) { //Caso o alerta não exista, simplestemente cria o alerta
            console.log("MISSING: CREATE THE ALERT TO PACKING:",p._id);
            alert.create({
              "actual_plant": p.actual_plant,
              "department": p.department,
              "packing": p._id,
              "supplier": p.supplier,
              "status": 1,
              "hashpacking": p.hashPacking,
              "serial": p.serial,
              "date": new Date().getTime()
            }).then(() => resolve(p));
          } else {
            console.log("MISSING: ALERT ALREADY EXIST TO PACKING:",p._id);
            alert.update({ //Verifica se o alerta ja existe
              "packing": p._id,
              "status": 1
            }, {
              "department": p.department,
              "actual_plant": p.actual_plant,
              "supplier": p.supplier,
              "hashpacking": p.hashPacking,
              "serial": p.serial
            }).then(() => resolve(p));
          }
        });
      }else{
        console.log("MISSING: NO CONFORMIDADE ABOUT THE PACKING:",p._id);
        resolve(p);
      }
    } else {
      //caso o alerta de missing tiver sido acionado
      console.log("MISSING: NO CONFORMIDADE ABOUT THE PACKING:",p._id);
      if(p.missing){
        p.missing = false;
        p.permanence = {
          "amount_days" : 0,
          "date" : new Date().getTime(),
          "time_exceeded" : false
        };
        historic.create(p)
                .then(alert.remove({
                  "packing": p._id,
                  "status": 1
                }))
                .then(() => resolve(p))
      }else{
        p.missing = false;
        alert.remove({
                  "packing": p._id,
                  "status": 1
                })
                .then(() => resolve(p))
        //remove qualquer tipo de alerta referente a este
      }
    }
  });
}
