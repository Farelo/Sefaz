const mongoose                  = require('mongoose');
const mongoosePaginate          = require('mongoose-paginate');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');


const packingSchema = new mongoose.Schema({
      code:{type: String, required: true},
      type: String,
      weigth: Number,
      width: Number,
      heigth: Number,
      length: Number,
      capacity: Number,
      status: Number,
      battery: Number,
      problem: Boolean,
      missing: Boolean,
      permanence : {
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
        rota: {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Route'
        },
      },
      latitude: Number,
      longitude: Number,
      temperature: Number,
      serial: {type: String, required: true},
      correct_plant_factory: {
          type:mongoose.Schema.Types.ObjectId,
          ref:'Plant'
      },
      gc16: {
          type:mongoose.Schema.Types.ObjectId,
          ref:'GC16'
      },
      correct_plant_supplier: {
          type:mongoose.Schema.Types.ObjectId,
          ref:'Plant'
      },
      actual_plant: {
          type:mongoose.Schema.Types.ObjectId,
          ref:'Plant'
      },
      tag : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tags'
      },
      department: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Department'
      },
      supplier: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Supplier'
      },
      project: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project'
      },
      hashPacking : String

});

packingSchema.plugin(mongooseAggregatePaginate);
packingSchema.plugin(mongoosePaginate);
mongoose.model('Packing', packingSchema);
