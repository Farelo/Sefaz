const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const adminClientSchema = new mongoose.Schema({
      name: {type: String, required: true},
      addrees: {type: String, required: true},
      cnpj: {type: String, required: true},
      profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
      }
});

adminClientSchema.plugin(mongoosePaginate);
mongoose.model('AdminClient', adminClientSchema);
