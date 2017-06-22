'use strict';

var SwaggerExpress = require('swagger-express-mw');
var express  = require('express');
const path = require('path');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
var cron = require('node-cron');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// cria nossa aplicação Express
// puxar informações por POST HTML (express4)
var bodyParser = require('body-parser');
// simular DELETE e PUT (express4)
var methodOverride = require('method-override');
var app = express();
// DEFININDO A APLICAÇÃO ==============================                                

// parse application/json          
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
//app.use(express.static(__dirname.replace("smart-api","smart-front/src")));
app.use(express.static(path.join(__dirname, '../smart-front/dist')));
console.log(__dirname.replace("smart-api","smart-front"));
module.exports = app; // for testing
// DATABASE ==============================================
require('./config.database')();

// MODELS ==============================================
require('./config.models')();
var config = {
  appRoot: __dirname // required config
};

require('./job/job');

var alert = mongoose.model('Alerts');
var query = require('./api/helpers/queries/complex_queries_alerts');
let http = require('http').Server(app);
let io = require('socket.io')(http);

let task = cron.schedule('*/10 * * * * *', function() {
    console.log("sEND menssage");
    var value = parseInt(1) > 0 ? ((parseInt(1) - 1) * parseInt(10)) : 0;
    var alertList = alert.aggregate(query.queries.listAlerts)
        .skip(value).limit(parseInt(10))
        .sort({_id: 1});
    var count = alert.find({}).count();

    Promise.all([count,alertList])
        .then(result =>  {io.emit('message', {type:'new-message', text: result[1]});
        console.log(result[1])} )
        .catch(err => console.log(err));
 });

io.on('connection', (socket) => {
  console.log('USER CONNECTED');

  socket.on('disconnect', function(){
    console.log('USER DISCONNECTED');

  });


  socket.on('add-message', (message) => {


  });
});
SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }
  app.use(SwaggerUi(swaggerExpress.runner.swagger));
  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 8984;
  http.listen(port, () => {
  console.log('started on port 8984');
});

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
