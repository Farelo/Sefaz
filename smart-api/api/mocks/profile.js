const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

const profileSchema = new mongoose.Schema({
      profile:{type: String, required: true},
      password: {type: String, required: true},
      email: {type: String, required: true , unique: true},
      city: {type: String, required: true },
      street: {type: String, required: true },
      telephone: {type: String},
      cellphone: {type: String},
      cep: {type: String, required: true },
      neighborhood: {type: String, required: true },
      uf: {type: String, required: true }

});
profileSchema.pre('remove', function(next) {
    // Remove all the assignment docs that reference the removed person.
    switch (this.profile) {
      case "Supplier":
        this.model('Supplier').findOne({"profile": this._id}).exec()
            .then(doc => doc.remove());
            next();
        break;
      case "Admin":
        console.log("Maçãs custam $0.32 o quilo.");
        break;
      case "AdminClient":
        console.log("Bananas custam $0.48 o quilo.");
        break;
      default:
        console.log("Desculpe, estamos sem nenhuma " + expr + ".");
    }


});

profileSchema.plugin(mongooseAggregatePaginate);
profileSchema.plugin(mongoosePaginate);
mongoose.model('Profile', profileSchema);
