var mongoose = require('mongoose');
 
var alertsSchema = new mongoose.Schema({
    actual_plant: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Plant'
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
          ref:'Department'
    },
    status: String,
    hashpacking : String
});
 

mongoose.model('Alerts', alertsSchema);
