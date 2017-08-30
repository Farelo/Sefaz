const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const profileSchema = new mongoose.Schema({
      profile:{type: Number, required: true},
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

profileSchema.plugin(mongoosePaginate);
mongoose.model('Profile', profileSchema);
