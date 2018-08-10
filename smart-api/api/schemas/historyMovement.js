const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const historicMovementSchema = new mongoose.Schema({
  plant: {
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant',
    },
    local: String,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
  },
  latitude: Number,
  longitude: Number,
  accuracy: Number,
  date: Number,
  temperature: Number,
  permanence: Number,
  battery: Number,
  packing_code: String,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
  serial: String,
  packing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Packing',
  },
  status: String,
}).plugin(mongoosePaginate);

module.exports = mongoose.model('HistoricMovement', historicMovementSchema);
