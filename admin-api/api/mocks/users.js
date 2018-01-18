const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');
const constants         = require('../helpers/constants');

const userSchema = new mongoose.Schema({
      company:{type: String},
      port: {type: String},
      url: {type: String , unique: true},
      email: {type: String, required: true , unique: true},
      profile: {type: String, required: true},
      password: {type: String}
});

userSchema.plugin(mongoosePaginate);
const user = mongoose.model('User', userSchema);
user.create(constants.system_user)
