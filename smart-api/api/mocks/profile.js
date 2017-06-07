var mongoose = require('mongoose');
 

var profileSchema = new mongoose.Schema({
      profile:{type: String, required: true},
      password: {type: String, required: true},
      email: {type: String, required: true , unique: true}
});

mongoose.model('Profile', profileSchema);
