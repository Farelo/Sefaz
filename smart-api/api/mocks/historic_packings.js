const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const historicPackingsSchema = new mongoose.Schema({
  plant: {
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant'
    },
    local: String
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
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
  actual_gc16: {
    days: Number,
    max: Number,
    min: Number,
  },
  serial: String,
  code: String,
  packing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Packing'
  }
});

historicPackingsSchema.plugin(mongoosePaginate);
mongoose.model('HistoricPackings', historicPackingsSchema);
