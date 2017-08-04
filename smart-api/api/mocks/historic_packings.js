const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const historicPackingsSchema = new mongoose.Schema({
  plant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant'
  },
  date: {
    type: Number
  },
  temperature: {
    type: Number
  },
  permanence_time: {
    type: Number
  },
  serial: String,
  packing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Packing'
  }
});

historicPackingsSchema.plugin(mongoosePaginate);
mongoose.model('HistoricPackings', historicPackingsSchema);
