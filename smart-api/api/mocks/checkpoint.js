const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const checkpointSchema = new mongoose.Schema({
    code:{type: String, required: true, unique: true},
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant'
    }
});
 
checkpointSchema.plugin(mongoosePaginate);
mongoose.model('Checkpoint', checkpointSchema);
