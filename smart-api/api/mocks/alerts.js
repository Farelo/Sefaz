const mongoose                  = require('mongoose');
const mongoosePaginate          = require('mongoose-paginate');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const alertsSchema = new mongoose.Schema({
    actual_plant: {
      plant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant'
      },
      local: String
    },
    department: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Department'
    },
    correct_plant_factory: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Plant'
    },
    correct_plant_supplier: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Plant'
    },
    packing: {
          type:mongoose.Schema.Types.ObjectId,
          ref:'Packing'
    },
    supplier: {
          type:mongoose.Schema.Types.ObjectId,
          ref:'Supplier'
    },
    status: Number,
    serial: String,
    date: Number,
    hashpacking : String
});

alertsSchema.plugin(mongooseAggregatePaginate);
alertsSchema.plugin(mongoosePaginate);
mongoose.model('Alerts', alertsSchema);
