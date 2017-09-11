const mongoose = require('mongoose');
const alert = mongoose.model('Alerts');
mongoose.Promise = global.Promise;

module.exports = function(p) {
  return new Promise(function(resolve, reject) {
    var oneSecond = 1000; // hours*minutes*seconds*milliseconds
    var date = new Date();
    var time = Math.round(Math.abs((p.lastCommunication - date.getTime())));
    if (time > 5000000000000000000) { //sumiu mais do que 3 horas
      //emite alerta
      p.missing = true;
      p.packing_missing = {
        "last_time": p.lastCommunication,
        "time_countdown": time,
        "route": p.actual_plant
      };

      alert.find({ //Verifica se o alerta ja existe
        "packing": p._id,
        "status": 1
      }).then(result => {
        if (result.length === 0) { //Caso o alerta não exista, simplestemente cria o alerta
          console.log("MISSING: CREATE THE ALERT TO PACKING: " + p._id);
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
          console.log("MISSING: ALERT ALREADY EXIST TO PACKING: " + p._id);
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

    } else {
      //remove qualquer tipo de alerta referente a este
      console.log("MISSING: NO CONFORMIDADE ABOUT THE PACKING: " + p._id);
      p.missing = false;
      alert.remove({
        "packing": p._id,
        "status": 1
      }).then(() => resolve(p));
    }
  });
}
