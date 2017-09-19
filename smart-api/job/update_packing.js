
const mongoose            = require('mongoose');
mongoose.Promise          = global.Promise;
const packing             = mongoose.model('Packing');



module.exports = function (p) {
  return packing.update({"_id": p._id},p);
}
