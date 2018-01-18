'use strict';

const SwaggerExpress   = require('swagger-express-mw');
const express          = require('express');
const logger           = require('morgan');
const bodyParser       = require('body-parser');
const methodOverride   = require('method-override');
const swaggerTools     = require('swagger-tools');
const environment      = require('./environment');
const port             = process.env.PORT || environment.port;
const app              = express();
const http             = require('http').Server(app);
const passport         = require("passport");
const HttpStatus       = require("http-status");
const swaggerObject    = require('./api/swagger/swagger.json');
const cors             = require('cors');
    
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
app.use(logger('dev'));
app.use(cors());
module.exports = app; // for testing

// DATABASE ==============================================
// MODELS ==============================================

require('./config/config.database').open(environment);
//JOB =================================================
require('./job/job');

//auth middleware
require('./api/auth/auth')(app);
//ALERTS
var config = {
  appRoot: __dirname // required config
};

swaggerObject.host = `${environment.url}:${environment.port}`;

//START middleware SWAGGER //em obras
swaggerTools.initializeMiddleware(swaggerObject, function(middleware) {

    var option = {
      Bearer: function (req, authOrSecDef, scopesOrApiKey, callback) {


        passport.authenticate('jwt', { session: false }, (err, user, info) => {

            if (err) return req.res.status(HttpStatus.UNAUTHORIZED).json({ jsonapi: { "version": "1.0" }, UNAUTHORIZED: 'The credentials are invalid!' });
            if (!user) return req.res.status(HttpStatus.UNAUTHORIZED).json({ jsonapi: { "version": "1.0" }, UNAUTHORIZED: 'The credentials are invalid!' });

            req.user = user;
            callback();
        })(req, null, callback);
      }
    };

    app.use(middleware.swaggerMetadata());
    app.use(middleware.swaggerValidator());
    app.use(middleware.swaggerSecurity(option));
    app.use(middleware.swaggerRouter({useStubs: true, controllers: './api/controllers'}));
    app.use(middleware.swaggerUi());

    http.listen(port, () => {
      console.log(`started on port ${environment.port}`);
    });
});
