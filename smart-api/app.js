'use strict';

const SwaggerExpress   = require('swagger-express-mw');
const express          = require('express');
const logger           = require('morgan');
const path             = require('path');
const cron             = require('node-cron');
const mongoose         = require('mongoose');
const bodyParser       = require('body-parser');
const methodOverride   = require('method-override');
const SwaggerUi        = require('swagger-tools/middleware/swagger-ui');
const port             = process.env.PORT || 8984;

mongoose.Promise = global.Promise;
const app = express();
// Middleware Initializate ==============================                                
        
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, '../smart-front/dist')));
app.use(logger('dev'));

module.exports = app; // for testing

// DATABASE ==============================================
require('./config/config.database')();

// MODELS ==============================================
require('./config/config.models')();
// require('./api/controllers/packing_controller').createAlerts();

// require('./api/controllers/packing_controller').createEstrategy();
//JOB =================================================
require('./job/job');

//ALERTS
var config = {
  appRoot: __dirname // required config
};


var alert = mongoose.model('Alerts');
var query = require('./api/helpers/queries/complex_queries_alerts');
let http = require('http').Server(app);
let io = require('socket.io')(http);

// let task = cron.schedule('*/10 * * * * *', function() {
//     var value = parseInt(1) > 0 ? ((parseInt(1) - 1) * parseInt(10)) : 0;
//     var alertList = alert.aggregate(query.queries.listAlerts)
//         .skip(value).limit(parseInt(10))
//         .sort({_id: 1});
//     var count = alert.find({}).count();
//
//     Promise.all([count,alertList])
//         .then(result =>  {
//
//           io.emit('message', {type:'new-message', text: result[1]
//         });
//         } )
//         .catch(err => console.log(err));
//  });
//
// io.on('connection', (socket) => {
//   console.log('USER CONNECTED');
//
//   socket.on('disconnect', function(){
//     console.log('USER DISCONNECTED');
//
//   });
//
//
//   socket.on('add-message', (message) => {
//
//
//   });
// });


//START middleware SWAGGER
SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }
  app.use(SwaggerUi(swaggerExpress.runner.swagger));

  // install middleware
  swaggerExpress.register(app);

  http.listen(port, () => {
  console.log('started on port 8984');
});
});
