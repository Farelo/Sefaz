
const mongoose            = require('mongoose');
mongoose.Promise          = global.Promise;
const cron                = require('node-cron');
const packing             = mongoose.model('Packing');
const route               = mongoose.model('Route');
const alert               = mongoose.model('Alerts');
const historic_packings   = mongoose.model('HistoricPackings');
const token               = require('./token');
const devices             = require('./devices');
const updateDevices       = require('./update_devices');
const consultDatabse      = require('./consult');

var task = cron.schedule('*/10 * * * * *', function() {
    token()
      .then(token => devices(token))//Get All devices from SIGFOX LOKA-API
      .then(devices => Promise.all(updateDevices(devices))) //UPDATE ALL PACKINGS WITH INFORMATION FROM LOKA-API
      .then(() => consult()) //RECEIVE ARRAY GET ALL PACKINGS AFTER UPDATE AND PLANTS
      .then(data => analysis(data)); //EVALUETE ALL PACKINGS, TO SEARCH SOME PROBLEM
});

function analysis(data){
  let packings = data[0]; //GET ALL PACKINGS
  let plants   = data[1]; //GET ALL PLANTS

  packings.forEach(p => {
      if(p.route){ //Evaluete if the packing has route

      }else{

      }
  });
}
