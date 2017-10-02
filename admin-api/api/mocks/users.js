const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');

const userSchema = new mongoose.Schema({
      company:{type: String, required: true},
      port: {type: String, required: true},
      url: {type: String, required: true , unique: true},
      email: {type: String, required: true , unique: true},
      profile: {type: String, required: true},
      password: {type: String}
});

userSchema.plugin(mongoosePaginate);
mongoose.model('User', userSchema);
