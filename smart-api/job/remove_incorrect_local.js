const mongoose    = require('mongoose');
const alert       = mongoose.model('Alerts');
mongoose.Promise  = global.Promise;

module.exports = function(p) {
  return new Promise(function(resolve, reject) {
        p.problem = false;
        console.log("REMOVED INCORRECT LOCAL AND TRAVELING TIME: NO CONFORMIDADE ABOUT THE PACKING:",p._id);
        alert.remove({
          "packing": p._id,
          "status": 2
        }).then(() => alert.remove({
          "packing": p._id,
          "status": 4
        }).then(() => resolve(p)));
  });
}
