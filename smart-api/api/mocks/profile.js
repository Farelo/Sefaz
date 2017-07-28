const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const profileSchema = new mongoose.Schema({
      profile:{type: String, required: true},
      password: {type: String, required: true},
      email: {type: String, required: true , unique: true}
});

profileSchema.plugin(mongoosePaginate);
mongoose.model('Profile', profileSchema);
