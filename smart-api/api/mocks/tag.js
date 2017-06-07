var mongoose = require('mongoose');
 

var tagSchema = new mongoose.Schema({
  code: {type: String, required: true, unique: true},
  mac: {type: String, required: true, unique: true},
  status: {type: String},
  friendly_name: {type: String}
});
 

mongoose.model('Tags', tagSchema);
