'use strict';

const express          = require('express');
const logger           = require('morgan');
const mongoose         = require('mongoose');
const bodyParser       = require('body-parser');
const methodOverride   = require('method-override');
const swaggerTools     = require('swagger-tools');
const environment      = require('./environment');
const port             = process.env.PORT || environment.port;
const app              = express();
const http             = require('http').Server(app);
const cors             = require('cors');
const swaggerObject    = require('./api/swagger/swagger.json');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
app.use(logger('dev'));
app.use(cors());
module.exports = app; // for testing

// DATABASE =============================================
require('./config/config.database').open(environment);
require('./config/config.user');


swaggerObject.host = `${environment.url}:${environment.port}`;

swaggerTools.initializeMiddleware(swaggerObject, function(middleware) {

    app.use(middleware.swaggerMetadata());
    app.use(middleware.swaggerValidator());
    app.use(middleware.swaggerRouter({useStubs: true, controllers: './api/controllers'}));
    app.use(middleware.swaggerUi());

    http.listen(port, () => {
      console.log(`started on port ${environment.port}`);
    });
});
