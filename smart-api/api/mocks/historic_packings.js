var mongoose = require('mongoose');

var historicPackingsSchema = new mongoose.Schema({
  historic : [
      {
        plant: {
              type: mongoose.Schema.Types.ObjectId,
              ref:'Plant'
        },
        data: {type: Date, default: Date.now}
      }
  ],
  packing: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Packing'
  }
});


mongoose.model('HistoricPackings', historicPackingsSchema);
