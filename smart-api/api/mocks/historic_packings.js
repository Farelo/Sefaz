const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const historicPackingsSchema = new mongoose.Schema({
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

historicPackingsSchema.plugin(mongoosePaginate);
mongoose.model('HistoricPackings', historicPackingsSchema);
