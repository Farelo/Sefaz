const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const adminSchema = new mongoose.Schema({
    name: {type: String, required: true},
    cpf:{type: String, required: true, unique: true},
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile'
    }

});
 
adminSchema.plugin(mongoosePaginate);
mongoose.model('Admin', adminSchema);
