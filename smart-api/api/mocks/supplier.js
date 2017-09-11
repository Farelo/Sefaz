const mongoose            = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');
const supplierSchema = new mongoose.Schema({
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

supplierSchema.pre('remove', function(next) {
    let supplier = this;
    console.log(supplier);
    // Remove all the assignment docs that reference the removed person.
    supplier.model('Plant').findOne({supplier: supplier._id}).exec()
        .then(doc => {
          doc.remove();
          let cursor = supplier.model('Packing').find({supplier: supplier._id}).cursor();
          cursor.on('data', function(doc) {
            // Called once for every document
            doc.remove();
          });

          cursor.on('close', function(doc) {
            // Called once for every document
            next();
          })
        });
});
supplierSchema.plugin(mongoosePaginate);
mongoose.model('Supplier', supplierSchema);
