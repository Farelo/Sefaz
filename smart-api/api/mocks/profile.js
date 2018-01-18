const mongoose                  = require('mongoose');
const mongoosePaginate          = require('mongoose-paginate');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const hashPassword              = require('../helpers/utils/encrypt')

const profileSchema = new mongoose.Schema({
      profile:{type: String, required: true},
      password: {type: String, required: true},
      email: {type: String, required: true , unique: true},
      user: {type: String },
      city: {type: String },
      street: {type: String },
      telephone: {type: String},
      cellphone: {type: String},
      cep: {type: String },
      neighborhood: {type: String },
      uf: {type: String },
      official_supplier: {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Supplier'
      },
      official_logistic: {
            type:mongoose.Schema.Types.ObjectId,
            ref:'LogisticOperator'
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

//change the password before them to be inserted in database
profileSchema.pre('save', function(next) {
  this.password = hashPassword.encrypt(this.password)
  next();
});




profileSchema.plugin(mongooseAggregatePaginate);
profileSchema.plugin(mongoosePaginate);
mongoose.model('Profile', profileSchema);
