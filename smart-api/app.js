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
const environment      = require('./environment');
const port             = process.env.PORT || environment.port;
const app              = express();
const http             = require('http').Server(app);
mongoose.Promise       = global.Promise;
    
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
// app.use(express.static(path.join(__dirname, '../smart-front/dist')));

app.use('/', express.static(path.join(__dirname, '../smart-front/dist')));

// app.get('*', function(req, res) {
//   res.sendFile(path.join(__dirname,'../smart-front/dist/index.html'));
// });

app.use(logger('dev'));

module.exports = app; // for testing

// DATABASE ==============================================
// MODELS ==============================================

require('./config/config.database').open(environment.database);
//JOB =================================================
require('./job/job');

//ALERTS
var config = {
  appRoot: __dirname // required config
};



//START middleware SWAGGER
SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  swaggerExpress.runner.swagger.host = environment.url + ":" + environment.port;
  app.use(SwaggerUi(swaggerExpress.runner.swagger));
  app.set(port);
  // install middleware
  swaggerExpress.register(app);

  http.listen(port, () => {
  console.log('started on port '+ environment.port);
});
});
