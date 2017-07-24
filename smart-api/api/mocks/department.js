var mongoose = require('mongoose');
 

var departmentSchema = new mongoose.Schema({
    name:String,
    lat: {type: Number},
    lng: {type: Number},
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant'
    }
});
 

mongoose.model('Department', departmentSchema);
