const mongoose    = require('mongoose');
const alert       = mongoose.model('Alerts');
mongoose.Promise  = global.Promise;

module.exports = {

  change: function(p, changeLocation) {
    console.log("CHANGE: PACKING: " + p._id);
    return new Promise(function(resolve, reject) {
      //remove qualquer alerta de permanencia referente a essa embalagem
      alert.remove({
        "packing": p._id,
        "status": 5
      }).then(() => resolve(p));
    });
  },

  fixednoroute: function(p) {
    return new Promise(function(resolve, reject) {

      if (!p.missing) {

        var date = new Date();
        var time = Math.round(Math.abs((p.permanence.date - date.getTime())));

        if(p.actual_gc16){
          var convertMili = 1000 * 60 * 60 * 24 * p.actual_gc16.days;
        }else{
          var convertMili = Infinity;
        }

        p.permanence.amount_days = time;
        p.permanence.time_exceeded = false;

        if(p.permanence.amount_days > convertMili){
          p.permanence.time_exceeded = true;
          alert.find({ //Verifica se o alerta ja existe
            "packing": p._id,
            "status": 5
          }).then( result => {
            if(result.length === 0){ //Caso o alerta não exista, simplestemente cria o alerta
              console.log("PERMANENCE TIME: ALERT CREATE TO PACKING: " + p._id);
              alert.create({
                "actual_plant": p.actual_plant,
                "packing": p._id,
                "supplier": p.supplier,
                "status": 5,
                "hashpacking": p.hashPacking,
                "serial": p.serial,
                "date": new Date().getTime()
              }).then(() => resolve(p));
            }else{
              console.log("PERMANENCE TIME: ALERT ALREADY EXIST TO PACKING: " + p._id);
              alert.update({ //Verifica se o alerta ja existe
                "packing": p._id,
                "status": 5
              },{
                "actual_plant": p.actual_plant,
                "supplier": p.supplier,
                "hashpacking": p.hashPacking,
                "serial": p.serial
              }).then(() => resolve(p));

            }
          });
        }else{
          console.log("PERMANENCE TIME: NO CONFORMIDADE ABOUT THE PACKING: " + p._id);
          alert.remove({
            "packing": p._id,
            "status": 5
          }).then(() => resolve(p));
        }
      } else {
        p.permanence = {
          "amount_days": 0,
          "date": 0,
          "time_exceeded": false
        };
        console.log("PERMANENCE TIME: NO CONFORMIDADE ABOUT THE PACKING: " + p._id);
        alert.remove({
          "packing": p._id,
          "status": 5
        }).then(() => resolve(p));
      }
    });
  }
}
