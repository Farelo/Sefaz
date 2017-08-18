const mongoose            = require('mongoose');
mongoose.Promise          = global.Promise;
const packing             = mongoose.model('Packing');

module.exports = function (devices) {
  var arrayOfPromises = [];
  devices.forEach(o => arrayOfPromises.push(packing.update(
    {code_tag: o.id}, o)));

  return arrayOfPromises;
}
