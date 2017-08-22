const mongoose          = require('mongoose');
const historic_packings = mongoose.model('HistoricPackings');
mongoose.Promise        = global.Promise;


module.exports = {
  create: function(p) {
    return historic_packings.create({
      "plant": p.actual_plant,
      "date": p.permanence.date,
      "temperature": p.temperature,
      "permanence_time": p.permanence.amount_days,
      "serial": p.serial,
      "supplier": p.supplier,
      "packing": p._id
    });
  },
  update: function(p) {
    return new Promise(function(resolve, reject) {
      if (!p.missing) {
        historic_packings.update({
          "packing": p._id,
          "date": p.permanence.date
        }, {
          "plant": p.actual_plant,
          "date": p.permanence.date,
          "temperature": p.temperature,
          "permanence_time": p.permanence.amount_days,
          "serial": p.serial,
          "supplier": p.supplier,
          "packing": p._id
        }).then(() => resolve("OK"));
      } else {
        resolve("OK");
      }
    });
  }
}
