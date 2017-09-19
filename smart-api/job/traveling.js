const mongoose        = require('mongoose');
const alert           = mongoose.model('Alerts');
mongoose.Promise      = global.Promise;


module.exports = {
  create: function(p) {
    return new Promise(function(resolve, reject) {
      var date = new Date()
      var transform = new Date(0);
      var time = Math.floor(date.getTime()-transform.setSeconds(p.lastCommunication));

      let result = p.routes.filter(r => {
        return r.time.max < time;
      });

      p.traveling = true;

      if (result.length > 0) { //Make sure the current plant belongs to the route
        console.log("TRAVELING TIME: ALERT CREATE TO PACKING:", p._id);
        p.trip = {
          'time_exceeded': true,
          'date': p.lastCommunication,
          'time_countdown':time
        };
        alert.create({
          "routes": p.routes,
          "packing": p._id,
          "supplier": p.supplier,
          "status": 4,
          "hashpacking": p.hashPacking,
          "serial": p.serial,
          "date": new Date().getTime()
        }).then(() => resolve(p));
      } else {
        console.log("TRAVELING TIME: NO CONFORMIDADE ABOUT THE PACKING:", p._id);
        p.trip = {
          'time_exceeded': false,
          'date': p.lastCommunication,
          'time_countdown':time
        };
        resolve(p);
      }
    });
  },
  evaluate_traveling: function(p) {
    return new Promise(function(resolve, reject) {

      if (p.traveling && p.missing) {
        if (p.trip.time_exceeded) {
          var date = new Date()
          var transform = new Date(0);
          var time = Math.floor(date.getTime()-transform.setSeconds(p.lastCommunication));
          p.trip = {
            'time_exceeded': true,
            'date': p.lastCommunication,
            'time_countdown':time
          };
          console.log("TRAVELING TIME: ALERT ALREADY EXIST TO PACKING:", p._id);
          alert.update({ //Verifica se o alerta ja existe
            "packing": p._id,
            "status": 4
          }, {
            "routes": p.routes,
            "supplier": p.supplier,
            "hashpacking": p.hashPacking,
            "serial": p.serial
          }).then(() => resolve(p));
        } else {

          module.exports.create(p).then(new_p => resolve(new_p));
        }
      } else {
        console.log("TRAVELING TIME: NO CONFORMIDADE ABOUT THE PACKING:", p._id);


          p.traveling = false;

          alert.remove({
            "packing": p._id,
            "status": 4
          }).then(() => resolve(p));

      }
    });
  }
}
