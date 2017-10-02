const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const profileSchema = new mongoose.Schema({
      profile:{type: String, required: true},
      password: {type: String, required: true},
      email: {type: String, required: true , unique: true},
      user: {type: String, required: true },
      city: {type: String, required: true },
      street: {type: String, required: true },
      telephone: {type: String},
      cellphone: {type: String},
      cep: {type: String, required: true },
      neighborhood: {type: String, required: true },
      uf: {type: String, required: true },
      official_supplier: {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Supplier'
      }

});

profileSchema.pre('remove', function(next) {
    // Remove all the assignment docs that reference the removed person.
    switch (this.profile) {
      case "Supplier":
        this.model('Supplier').findOne({"profile": this._id}).exec()
            .then(doc => doc.remove());
            next();
        break;
      case "Logistic":
        this.model('LogisticOperator').findOne({"profile": this._id}).exec()
            .then(doc => doc.remove());
            next();
        break;
      default:
        next();
    }


});

profileSchema.plugin(mongooseAggregatePaginate);
profileSchema.plugin(mongoosePaginate);
mongoose.model('Profile', profileSchema);
