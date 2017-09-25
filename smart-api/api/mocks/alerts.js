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
    routes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route'
    }],
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    department: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Department'
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
