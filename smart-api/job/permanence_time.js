const mongoose    = require('mongoose');
const alert       = mongoose.model('Alerts');
mongoose.Promise  = global.Promise;

module.exports = {

  change: function(p, changeLocation) {
    console.log("CHANGE: PACKING: " + p._id);
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
    });
  },

  fixednoroute: function(p) {
    return new Promise(function(resolve, reject) {

      if (!p.missing) {
        var oneSecond = 1000; //1000 * 3600 * 24 hours*minutes*seconds*milliseconds
        var date = new Date();
        var diffDays = Math.round(Math.abs((p.permanence.date - date.getTime()) / (oneSecond)));
        p.permanence.amount_days = diffDays;
        p.permanence.time_exceeded = true;
        if(p.permanence.amount_days > 10000000000){

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
        console.log("PERMANENCE TIME: NO CONFORMIDADE ABOUT THE PACKING: " + p._id);
        alert.remove({
          "packing": p._id,
          "status": 5
        }).then(() => resolve(p));
      }
    });
  }
}
