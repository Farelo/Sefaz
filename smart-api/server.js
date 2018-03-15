'use strict';

const express          = require('express');
const logger           = require('morgan');
const bodyParser       = require('body-parser');
const methodOverride   = require('method-override');
const swaggerTools     = require('swagger-tools');
const environment      = require('./config/environment');
const passport         = require("passport");
const HttpStatus       = require("http-status");
const swaggerObject    = require('./api/swagger/swagger.json');
const cors             = require('cors');
const compression      = require('compression');
const app              = express();
const http             = require('http').Server(app);
const port             = process.env.PORT || environment.port;
const io               = require('socket.io')(http);

//sentando configurações do middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true}));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
app.use(logger('dev'));
app.use(cors());
app.use(compression());

module.exports = app; // for testing


//conexão com o banco de dados do mongo
require('./config/database/connection').open(environment);
require('./config/initial/create_user'); //criando o usuário

//JOB =================================================
require('./job/main');

//adicionando a auth no middleware
require('./api/auth/auth')(app);



////////////////////// TESTANTO SOCKET IO PARA REALIZAR APLICAÇÃO REAL TIME

// io.on('connection', (socket) => {

//   console.log('USER CONNECTED');



//   socket.on('disconnect', function () {

//     console.log('USER DISCONNECTED');

//   });

//   socket.on('add-message', (message) => {
//     console.log(message)
//     io.emit('message', { type: 'new-message', text: message });

//   });

// });


//////////////////////

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

  // adicionando os middlewaeres do swagger na aplicação
    app.use(middleware.swaggerMetadata());
    app.use(middleware.swaggerValidator());
    app.use(middleware.swaggerSecurity(option));
    app.use(middleware.swaggerRouter({useStubs: true, controllers: './api/controllers'}));
    app.use(middleware.swaggerUi());

    http.listen(port, () => {
      console.log(`started on port ${environment.port}`);
    });
});
