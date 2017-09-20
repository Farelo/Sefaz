const mongoose     = require('mongoose');
const alert        = mongoose.model('Alerts');
const packing      = mongoose.model('Packing');
const historic     = require('./historic');
const alerts_type  = require('./alerts_type');
mongoose.Promise   = global.Promise;

module.exports = function(p) {
  return new Promise(function(resolve, reject) {

    if(p.missing){
      console.log("MISSING: ALERT ALREADY EXIST TO PACKING:",p._id);
      var date = new Date()
      var time = Math.floor(date.getTime()-p.packing_missing.date);

      p.packing_missing = {
        "date": p.packing_missing.date,
        "time_countdown": time
      };
      alert.update({ //Verifica se o alerta ja existe
        "packing": p._id,
        "status": alerts_type.MISSING
      }, {
        "department": p.department,
        "actual_plant": p.last_plant,
        "supplier": p.supplier,
        "hashpacking": p.hashPacking,
        "serial": p.serial
      }).then(() => resolve(p));
    }else{
      if(p.traveling){
        console.log("MISSING: NO CONFORMIDADE ABOUT THE PACKING:",p._id);
        resolve(p);
      }else{
        //CRIA O ALERTA
        console.log("MISSING: CREATE THE ALERT TO PACKING:",p._id);
        p.missing = true;
        p.packing_missing = {
          "date": new Date().getTime(),
          "time_countdown": 0,
        };
        p.last_plant = p.actual_plant;

        alert.create({
            "packing": p._id,
            "department": p.department,
            "actual_plant": p.last_plant,
            "supplier": p.supplier,
            "status": alerts_type.MISSING,
            "hashpacking": p.hashPacking,
            "serial": p.serial,
            "date": new Date().getTime()
          })
        .then(() => alert.remove({"packing": p._id,"status": alerts_type.TRAVELING}))
        .then(() => resolve(p));
      }
    }
  });
}
