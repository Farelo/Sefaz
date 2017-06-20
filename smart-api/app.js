'use strict';

var SwaggerExpress = require('swagger-express-mw');
var express  = require('express');
const path = require('path');
var SwaggerUi = require('swagger-tools/middleware/swagger-ui');
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

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }
  app.use(SwaggerUi(swaggerExpress.runner.swagger));
  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 8080;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
