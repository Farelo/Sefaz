const mongoose          = require('mongoose');
const historic_packings = mongoose.model('HistoricPackings');
mongoose.Promise        = global.Promise;


module.exports = {
  create: function(p) {
    return historic_packings.create({
      "actual_gc16":  p.actual_gc16,
      "plant": p.actual_plant,
      "department": p.department,
      "date": p.permanence.date,
      "temperature": p.temperature,
      "permanence_time": p.permanence.amount_days,
      "serial": p.serial,
      "supplier": p.supplier,
      "packing": p._id,
      "packing_code": p.code
    });
  },
  update: function(p) {
    return new Promise(function(resolve, reject) {
      if (!p.missing) {

          historic_packings.update({
            "packing": p._id,
            "date": p.permanence.date
          }, {
            "actual_gc16":  p.actual_gc16 ,
            "department": p.department  ,
            "plant": p.actual_plant,
            "date": p.permanence.date,
            "temperature": p.temperature,
            "permanence_time": p.permanence.amount_days,
            "serial": p.serial,
            "supplier": p.supplier,
            "packing": p._id,
            "packing_code": p.code
          }).then(() => resolve("OK"));

      } else {
        resolve("OK");
      }
    });
  }
}
