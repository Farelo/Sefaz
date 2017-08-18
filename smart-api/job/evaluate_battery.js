const mongoose      = require('mongoose');
const alert         = mongoose.model('Alerts');
mongoose.Promise    = global.Promise;

module.exports = function(p) {
    return new Promise(function(resolve, reject) {
        if (p.battery < 25) {
          //EMITIR ALERTA
          alert.update({
            "packing": p._id,
            "status": 3
          }, {
            "actual_plant": p.actual_plant,
            "packing": p._id,
            "supplier": p.supplier,
            "status": 3,
            "hashpacking": p.hashPacking,
            "serial": p.serial,
            "date": new Date().getTime()
          }, {
            upsert: true
          }).then(() => resolve("ok"));
        } else {
          //remove qualquer alerta de bateria referente a essa embalagem
          alert.remove({
            "packing": p._id,
            "status": 3
          }).then(() => resolve("ok"));
        }

      }

    }
