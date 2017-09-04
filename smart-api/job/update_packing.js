
const mongoose            = require('mongoose');
mongoose.Promise          = global.Promise;
const packing             = mongoose.model('Packing');



module.exports = function (p) {
  console.log(p.actual_gc16.equals(null));
  if(p.actual_gc16 == null || p.missing){
    console.log("UPDATE PACKING REMOVE: "+p._id);
    return packing.update({"_id": p._id},{$unset: {actual_gc16: 1}},p);
  }else{
    console.log("UPDATE PACKING: "+p._id);
    return packing.update({"_id": p._id},p);
  }
}
