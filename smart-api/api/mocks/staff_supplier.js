var mongoose = require('mongoose');

var sttafSupplierSchema = new mongoose.Schema({
      name: {type: String, required: true},
      addrees: {type: String, required: true},
      profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
      },
      supplier: {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Supplier'
      }
});

mongoose.model('StaffSupplier', sttafSupplierSchema);
