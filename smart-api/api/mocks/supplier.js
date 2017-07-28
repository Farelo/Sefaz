var mongoose = require('mongoose');

var supplierSchema = new mongoose.Schema({
      name: {type: String, required: true},
      duns: {type: String, required: true},
      cnpj:{type: String},
      profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
      },
      plant: {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Plant'
      },
      hashPacking: {type: String}
});

mongoose.model('Supplier', supplierSchema);
