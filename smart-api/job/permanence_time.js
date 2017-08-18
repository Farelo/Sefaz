const mongoose      = require('mongoose');
const alert         = mongoose.model('Alerts');
mongoose.Promise    = global.Promise;

module.exports = {


    change: function(p, changeLocation) {

        return new Promise(function(resolve, reject) {
              p.permanence = {
                "amount_days": 0,
                "date": new Date().getTime(),
                "time_exceeded": false
              };
              //remove qualquer alerta de permanencia referente a essa embalagem
              alert.remove({
                "packing": p._id,
                "status": 5
              }).then(() => resolve(p));
            }
            p.permanence = {
              "amount_days": 0,
              "date": new Date().getTime(),
              "time_exceeded": false
            };

          },

          fixednoroute: function(p) {
            return new Promise(function(resolve, reject) {

              if(!p.missing){
                var oneSecond = 1000; // hours*minutes*seconds*milliseconds
                var date = new Date();
                var diffDays = Math.round(Math.abs((p.permanence.date - date.getTime()) / (oneSecond)));
                p.permanence.amount_days = diffDays;
                resolve(p);
              }else{
                resolve(p);
              }
              }
            }
          }
