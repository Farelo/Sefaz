const swaggerTools = require('swagger-tools');
const environment = require('../../config/environment');
const swaggerObject = require('../../api/swagger/swagger.json');
const debug = require('debug')('swagger');
const auth = require('../../api/auth/auth');

/**
 * Realiza a configuração do Swagger
 * @param {Express} app
 */
function init(app) {
  // verifica se o servidor esta rodando em produção e avalia as variaveis do mesmo
  if (process.env.NODE_ENV === 'production') {
    if (process.env.DNS || process.env.HOST || process.env.PORT) {
      if (process.env.HOST) {
        swaggerObject.host = `${process.env.HOST}:${process.env.PORT}`;
      } else if (process.env.DNS) {
        swaggerObject.host = `${process.env.DNS}`;
      } else {
        debug('faltou inserir algumas variaveis de ambiente');
        swaggerObject.host = `${environment.url}:${environment.port}`;
      }
    } else {
      // caso contrario utiliza as variaveis de ambiente padrão
      swaggerObject.host = `${environment.url}:${environment.port}`;
    }
  } else {
    // caso o copntrario uitiliza as variaveis de ambiente em desenvolvimento
    swaggerObject.host = `${environment.url}:${environment.port}`;
  }

  // START middleware SWAGGER
  swaggerTools.initializeMiddleware(swaggerObject, (middleware) => {
    const option = {
      Bearer(req, authOrSecDef, scopesOrApiKey, callback) {
        auth.authenticate(req, callback);
      },
    };

    middleware.swaggerUi({});
    // adicionando os middlewaeres do swagger na aplicação
    app.use(middleware.swaggerMetadata());
    app.use(middleware.swaggerValidator());
    app.use(middleware.swaggerSecurity(option));
    app.use(
      middleware.swaggerRouter({
        useStubs: true,
        controllers: './api/controllers',
      }),
    );

    app.use(middleware.swaggerUi({ docExpansion: ['none'] }));
    // redirecionando para a documentação do swagger
    app.get('/', (req, res) => {
      // todo aguenta
      res.redirect('/docs');
    });
  });
}

module.exports = {
  init,
};
