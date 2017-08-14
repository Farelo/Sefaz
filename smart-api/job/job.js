
const mongoose            = require('mongoose');
mongoose.Promise          = global.Promise;
const cron                = require('node-cron');
const packing             = mongoose.model('Packing');
const route               = mongoose.model('Route');
const alert               = mongoose.model('Alerts');
const historic_packings   = mongoose.model('HistoricPackings');
const Scanned             = [];
const token               = require('./token');
const devices             = require('./devices');


var task = cron.schedule('*/10 * * * * *', function() {
    token()
      .then(token => devices(token))
      .then(devices => console.log(devices));
});
