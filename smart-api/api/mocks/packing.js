const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');


const packingSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  type: String,
  weigth: Number,
  width: Number,
  heigth: Number,
  length: Number,
  capacity: Number,
  battery: Number,
  problem: Boolean,
  missing: Boolean,
  lastCommunication: Number,
  permanence: {
    time_exceeded: Boolean,
    date: Number,
    amount_days: Number
  },
  trip: {
    time_exceeded: Boolean,
    date: Number,
    time_countdown: Number,
  },
  packing_missing: {
    last_time: Number,
    time_countdown: Number,
  },
  position: {
    latitude: Number,
    longitude: Number,
    accuracy: Number,
    date: Number
  },
  actual_gc16: {
    days: Number,
    max: Number,
    min: Number,
  },
  temperature: Number,
  serial: {
    type: String,
    required: true,
    unique: true
  },
  gc16: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GC16'
  },
  routes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  }],
  actual_plant: {
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant'
    },
    local: String
  },
  tag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tags'
  },
  code_tag: String,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  hashPacking: String

});
packingSchema.post('remove', function(next) {
  let packing  = this;
  // Remove all the assignment docs that reference the removed person.
  packing.model('Alerts').remove({packing: packing._id})
          .then(() => packing.model('HistoricPackings').remove({packing: packing._id}))
          .then(() => evaluete(Promise.all([this.model('Packing').find({gc16: packing.gc16}), packing.model('Packing').find({routes: {$in: packing.routes}})]), next,packing));

});
packingSchema.plugin(mongooseAggregatePaginate);
packingSchema.plugin(mongoosePaginate);

mongoose.model('Packing', packingSchema);


function evaluete(promise, next, p) {

  promise.then(result => {
    if (result[0].length === 0 && result[1].length === 0) {
      p.model('GC16').remove({
          _id: p.gc16
        })
        .then(() => p.model('Route').remove({
          _id: {
            $in: p.routes
          }
        }))
        .then(() => next());
    } else if (result[0].length === 0) {
      p.model('GC16').remove({
        _id: p.gc16
      }).then(() => next());
    } else if (result[1].length === 0) {
      p.model('Route').remove({
        _id: {
          $in: p.routes
        }
      }).then(() => next());
    } else {
      next();
    }
  });
}
