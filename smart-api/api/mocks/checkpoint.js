var mongoose = require('mongoose');
 
var checkpointSchema = new mongoose.Schema({
    code:{type: String, required: true, unique: true},
    place_id: {type: Number},
    department: {
          type:mongoose.Schema.Types.ObjectId,
          ref:'Department'
    },
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant'
    }
});
 

mongoose.model('Checkpoint', checkpointSchema);
