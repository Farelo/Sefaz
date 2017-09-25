const mongoose     = require('mongoose');
const alert        = mongoose.model('Alerts');
const alerts_type  = require('./alerts_type');
mongoose.Promise   = global.Promise;

module.exports = {

  whith_plant : function(p){
    return new Promise(function(resolve, reject) {
          if(p.traveling || p.missing || p.problem){
            console.log("REMOVED DEPENDENCIES ABOUT PACKING:",p._id);
            p.problem = false;
            p.missing = false;
            p.traveling = false;

            p.trip = {
              'time_exceeded': false,
              'date': 0,
              'time_countdown': 0
            };
            p.packing_missing = {
              "date": 0,
              "time_countdown": 0
            };

            alert.remove({
              "packing": p._id,
              "status": { '$in': [ alerts_type.INCORRECT_LOCAL, alerts_type.TRAVELING , alerts_type.MISSING ] }
            }).then(() => resolve(p));
          }else{
            resolve(p);
          }
    });
  },
  without_plant : function(p){
    return new Promise(function(resolve, reject) {

      if(!p.missing && !p.traveling){
        console.log("REMOVED DEPENDENCIES ABOUT PACKING:",p._id);
        p.problem = false;
        p.permanence = {
          "amount_days" : 0,
          "date" : 0,
          "time_exceeded" : false
        };
        alert.remove({
          "packing": p._id,
          "status": { '$in': [ alerts_type.INCORRECT_LOCAL, alerts_type.PERMANENCE] }
        }).then(() => resolve(p));

      }else if(p.routes.length === 0){
        console.log("aqui");
        p.traveling = false;
        p.trip = {
          'time_exceeded': false,
          'date': 0,
          'time_countdown': 0
        };
        resolve(p);
      }else{
        resolve(p);
      }
    });
  }
}
