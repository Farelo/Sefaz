const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const sttafSupplierSchema = new mongoose.Schema({
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
}).plugin(mongoosePaginate);

module.exports = mongoose.model('StaffSupplier', sttafSupplierSchema);
