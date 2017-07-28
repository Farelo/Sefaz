const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const tagSchema = new mongoose.Schema({
  code: {type: String, required: true, unique: true},
  mac: {type: String, required: true, unique: true},
  status: {type: String}
});
 
tagSchema.plugin(mongoosePaginate);
mongoose.model('Tags', tagSchema);
