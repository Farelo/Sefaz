var mongoose = require('mongoose');
 

var packingSchema = new mongoose.Schema({
      code:{type: String, required: true},
      type: String,
      weigth: Number,
      width: Number,
      heigth: Number,
      length: Number,
      capacity: Number,
      status: String,
      problem: Boolean,
      missing: Boolean,
      permanence_exceeded: Boolean,
      last_time: Date,
      amount_days: Number,
      last_time_missing: Date,
      time_countdown: Number,
      correct_plant_factory: {
          type:mongoose.Schema.Types.ObjectId,
          ref:'Plant'
      },
      correct_plant_supplier: {
          type:mongoose.Schema.Types.ObjectId,
          ref:'Plant'
      },
      actual_plant: {
          type:mongoose.Schema.Types.ObjectId,
          ref:'Plant'
      },
      tag_mac: String,
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
 

 mongoose.model('Packing', packingSchema);
