const mongoose    = require('mongoose');
const alert       = mongoose.model('Alerts');
mongoose.Promise  = global.Promise;

module.exports = function(p) {
  return new Promise(function(resolve, reject) {
    if (p.battery < 75) {
      //EMITIR ALERTA
      alert.find({ //Verifica se o alerta ja existe
        "packing": p._id,
        "status": 3
      }).then(result => {
        if (result.length === 0) { //Caso o alerta não exista, simplestemente cria o alerta
          console.log("BATTERY: ALERT CREATE TO PACKING: " + p._id);
          alert.create({
            "actual_plant": p.actual_plant,
            "packing": p._id,
            "supplier": p.supplier,
            "status": 3,
            "hashpacking": p.hashPacking,
            "serial": p.serial,
            "date": new Date().getTime()
          }).then(() => resolve(p));
        } else {
          console.log("BATTERY: ALERT ALREADY EXIST TO PACKING: " + p._id);
          alert.update({ //Verifica se o alerta ja existe
            "packing": p._id,
            "status": 3
          },{
            "actual_plant": p.actual_plant,
            "supplier": p.supplier,
            "hashpacking": p.hashPacking,
            "serial": p.serial
          }).then(() => resolve(p));
        }
      });
    } else {
      //remove qualquer alerta de bateria referente a essa embalagem
      console.log("BATTERY: NO CONFORMIDADE ABOUT THE PACKING: " + p._id);
      alert.remove({
        "packing": p._id,
        "status": 3
      }).then(() => resolve(p));
    }
  });
}
