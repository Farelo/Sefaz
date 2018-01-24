const mongoose           = require('mongoose');
const user               = mongoose.model('User');
const constants          = require('../api/helpers/constants');
mongoose.Promise         = global.Promise;


user.create(constants.system_user)
