const mongoose           = require('mongoose');
const constants          = require('../api/helpers/constants');
const profile            = mongoose.model('Profile');
mongoose.Promise         = global.Promise;

profile.create(constants.system_user)
