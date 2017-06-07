var mongoose = require('mongoose');

var staffSchema = new mongoose.Schema({
      name: {type: String, required: true},
      addrees: {type: String, required: true},
      profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
      }
});

mongoose.model('Staff', staffSchema);
