const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const environment = require('./config/environment');
const auth = require('./api/auth/auth');
const swagger = require('./config/swagger/settings');
const server = require('./config/server/server');
const database = require('./config/database/connection');
const systemSettings = require('./config/initial/system_settings');
const jobPacking = require('./job/main');

const app = express();
const winston = require('./config/logger/winston');

// realizando as configurações do Middleware
app.use(
  bodyParser.json({
    limit: '100mb',
  }),
);

app.use(
  bodyParser.urlencoded({
    extended: 'true',
    limit: '100mb',
  }),
);

app.use(morgan('combined', { stream: winston.stream })); // log que será armazenado em um arquivo

// sentando configurações do middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
app.use(logger('dev'));
app.use(cors());
app.use(compression());

// conexão com o banco de dados do mongo
database.open(environment);
// Inicializando as configurações so sistema
systemSettings.start();
// Inicializando o Job de rastreamento de embalagens
jobPacking.start();
// adicionando a auth no middleware
auth.setupAuth(app);
// inicializando a configuração do swagger
swagger.init(app);
// inicializando a configuração do servidor
server.start(app);

module.exports = app; // for testing
