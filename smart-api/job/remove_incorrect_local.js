const mongoose    = require('mongoose');
const alert       = mongoose.model('Alerts');
mongoose.Promise  = global.Promise;

module.exports = function(p) {
  return new Promise(function(resolve, reject) {
        p.problem = false;
        console.log("INCORRECT LOCAL REMOVED: NO CONFORMIDADE ABOUT THE PACKING: " + p._id);
        alert.remove({
          "packing": p._id,
          "status": 2
        }).then(() => resolve(p));
  });
}
