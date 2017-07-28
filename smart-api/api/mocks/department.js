const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const departmentSchema = new mongoose.Schema({
    name:String,
    lat: {type: Number},
    lng: {type: Number},
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant'
    }
});
 
departmentSchema.plugin(mongoosePaginate);
mongoose.model('Department', departmentSchema);
