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
require('./config/initial/system_settings'); //configurando o sistema

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
//verifica se o servidor esta rodando em produção e avalia as variaveis do mesmo
if (process.env.NODE_ENV === 'production'){
  if (process.env.DNS || process.env.HOST || process.env.PORT){
    if (process.env.HOST){
      swaggerObject.host = `${process.env.HOST}:${process.env.PORT}`;
    } else if (process.env.DNS){
      swaggerObject.host = `${process.env.DNS}`;
    }else{
      console.log("faltou inserir algumas variaveis de ambiente")
      swaggerObject.host = `${environment.url}:${environment.port}`;
    }
  }else{//caso contrario utiliza as variaveis de ambiente padrão
    swaggerObject.host = `${environment.url}:${environment.port}`;
  }
}else{//caso o copntrario uitiliza as variaveis de ambiente em desenvolvimento
  swaggerObject.host = `${environment.url}:${environment.port}`;
}


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
      if (process.env.NODE_ENV === 'production'){
        if (process.env.HOST) {
          console.log(`started on ${process.env.HOST}:${process.env.PORT}`)
        } else if (process.env.DNS) {
          console.log(`started on ${process.env.DNS}`)
        } else {
          console.log(`started on ${environment.url}:${environment.port}`);
        }
        
      }else{
        console.log(`started on ${environment.url}:${environment.port}`);
      }
    });
});
