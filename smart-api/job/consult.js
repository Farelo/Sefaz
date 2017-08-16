
const mongoose            = require('mongoose');
mongoose.Promise          = global.Promise;
const packing             = mongoose.model('Packing');
const plant               = mongoose.model('Plant');


module.exports = function () {
  var arrayOfPromises = [
    packing.find({})
  .populate('tag')
  .populate('actual_plant')
  .populate('department')
  .populate('supplier')
  .populate('route')
  .populate('project'), plant.find({})];

  return arrayOfPromises;
}
