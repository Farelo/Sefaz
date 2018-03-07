const mongoose          = require('mongoose');
const mongoosePaginate  = require('mongoose-paginate');
const constants         = require('../helpers/utils/constants');
const hashPassword      = require('../helpers/utils/encrypt')

const userSchema = new mongoose.Schema({
      company:{type: String},
      port: {type: String},
      url: {type: String , unique: true},
      email: {type: String, required: true , unique: true},
      profile: {type: String, required: true},
      password: {type: String}
});

//change the password before them to be inserted in database
userSchema.pre('save', function(next) {
  if(this.password ) this.password = hashPassword.encrypt(this.password)
  next();
});

userSchema.plugin(mongoosePaginate);

mongoose.model('User', userSchema);
