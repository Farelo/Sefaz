
const mongoose            = require('mongoose');
mongoose.Promise          = global.Promise;
const packing             = mongoose.model('Packing');



module.exports = {
  set: function(p){
    return packing.update({"_id": p._id},p);
  },
  unset: function(p){
    return packing.update({"_id": p._id},{$unset: {'actual_plant': 1}});
  }
}
