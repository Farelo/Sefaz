const mongoose        = require('mongoose');
const alert           = mongoose.model('Alerts');
mongoose.Promise      = global.Promise;
const alerts_type     = require('./alerts_type');

module.exports = {
  set: function(p){
    return new Promise(function(resolve, reject) {
      p.missing = false;
      p.traveling = true;
      p.trip = {
        'time_exceeded': false,
        'date': new Date().getTime(),
        'time_countdown': 0
      };
      resolve(p);
    });
  },
  create: function(p) {
    return new Promise(function(resolve, reject) {

      var date = new Date()
      var time = Math.floor(date.getTime()-p.trip.date);

      let result = p.routes.filter(r => {
        return r.time.max < time;
      });

      p.traveling = true;

      if (result.length > 0) { //Make sure the current plant belongs to the route
        console.log("TRAVELING TIME: ALERT CREATE TO PACKING:", p._id);
        p.trip = {
          'time_exceeded': true,
          'date': p.trip.date,
          'time_countdown':time
        };
        alert.create({
          "routes": p.routes,
          "packing": p._id,
          "supplier": p.supplier,
          "status": alerts_type.TRAVELING,
          "hashpacking": p.hashPacking,
          "serial": p.serial,
          "date": new Date().getTime()
        }).then(() => resolve(p));
      } else {
        console.log("TRAVELING TIME: NO CONFORMIDADE ABOUT THE PACKING:", p._id);
        p.trip = {
          'time_exceeded': false,
          'date': p.trip.date,
          'time_countdown':time
        };
        resolve(p);
      }
    });
  },
  evaluate_traveling: function(p) {
    return new Promise(function(resolve, reject) {
      if(p.traveling){
        if (p.trip.time_exceeded) {
          console.log("TRAVELING TIME: ALERT ALREADY EXIST TO PACKING:", p._id);
          var date = new Date()

          var time = Math.floor(date.getTime()-p.trip.date);
          p.trip = {
            'time_exceeded': true,
            'date': p.trip.date,
            'time_countdown':time
          };
          alert.update({ //Verifica se o alerta ja existe
            "packing": p._id,
            "status": alerts_type.TRAVELING
          }, {
            "routes": p.routes,
            "supplier": p.supplier,
            "hashpacking": p.hashPacking,
            "serial": p.serial
          }).then(() => resolve(p));
        } else {
          module.exports.create(p).then(new_p => resolve(new_p));
        }
      }else{
        resolve(p);
      }
    });
  }
}
