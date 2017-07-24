var mongoose = require('mongoose');
 
var checkpointSchema = new mongoose.Schema({
    code:{type: String, required: true, unique: true},
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant'
    }
});
 

mongoose.model('Checkpoint', checkpointSchema);
