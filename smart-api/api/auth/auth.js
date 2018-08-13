const passport = require('passport');
const passport_jwt = require('passport-jwt');
const HttpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const schemas = require('../../api/schemas/require_schemas');
const environment = require('../../config/environment');

const opts = {
  secretOrKey: environment.secret,
  jwtFromRequest: passport_jwt.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
};

function strategy(jwtPayload, done) {
  // multiplica por 1000 para vira milisegundos
  const expirationDate = new Date(jwtPayload.exp * 1000);

  if (expirationDate < new Date()) {
    // verifica se o token expirou
    return done(null, false);
  }
  schemas.profile
    .findOne({
      _id: jwtPayload.id,
    })
    .then((profile) => {
      const payload = { id: profile._id };

      if (profile) {
        return done(null, {
          id: profile._id,
          email: profile.email,
          refresh_token: `JWT ${jwt.sign(payload, environment.secret, {
            expiresIn: environment.expiresIn,
          })}`,
        });
      }
      return done(null, false);
    })
    .catch((error) => {
      done(error, null);
    });
}

/**
 * Realiza a autenticação do usuário que esta realizando a requisição
 * @param {Request} req request realizado pelo usuário
 * @param {Function} callback função de retorno da autenticação
 */
function authenticate(req, callback) {
  return passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return req.res.status(HttpStatus.UNAUTHORIZED).json({
        jsonapi: { version: '1.0' },
        UNAUTHORIZED: 'The credentials are invalid!',
      });
    }
    if (!user) {
      return req.res.status(HttpStatus.UNAUTHORIZED).json({
        jsonapi: { version: '1.0' },
        UNAUTHORIZED: 'The credentials are invalid!',
      });
    }

    req.user = user;
    callback();
  })(req, null, callback);
}

function setupAuth(app) {
  app.use(passport.initialize());
  passport.use(new passport_jwt.Strategy(opts, strategy));
}

module.exports = {
  setupAuth,
  authenticate,
};
