const mongoose      = require('mongoose');
const alert         = mongoose.model('Alerts');
mongoose.Promise    = global.Promise;

module.exports = function(p) {
    return new Promise(function(resolve, reject) {
          var oneSecond = 1000; // hours*minutes*seconds*milliseconds
          var date = new Date();
          var diffDays = Math.round(Math.abs((p.lastCommunication - date.getTime()) / (oneSecond)));
          if(diffDays > 3){ //sumiu mais do que uma 3 horas
            //emite alerta
            p.missing = true;
            p.packing_missing = {
              "last_time": p.lastCommunication,
              "time_countdown": diffDays,
              "route": p.actual_plant
            };

            alert.update({
              "packing": p._id,
              "status": 3
            }, {
              "actual_plant": p.actual_plant,
              "packing": p._id,
              "supplier": p.supplier,
              "status": 1,
              "hashpacking": p.hashPacking,
              "serial": p.serial,
              "date": new Date().getTime()
            }, {
              upsert: true
            }).then(() => resolve(p));

          }else{
            //remove qualquer tipo de alerta referente a este
            alert.remove({
              "packing": p._id,
              "status": 3
            }).then(() => resolve(p));
          }

      }

    }
