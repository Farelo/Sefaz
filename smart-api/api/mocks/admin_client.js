var mongoose = require('mongoose');

var adminClientSchema = new mongoose.Schema({
      name: {type: String, required: true},
      addrees: {type: String, required: true},
      cnpj: {type: String, required: true},
      profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
      }
});

mongoose.model('AdminClient', adminClientSchema);
