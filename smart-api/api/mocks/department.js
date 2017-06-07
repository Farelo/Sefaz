var mongoose = require('mongoose');
 

var departmentSchema = new mongoose.Schema({
    name:String,
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant'
    }
});
 

mongoose.model('Department', departmentSchema);
