const passport                                  = require("passport");
const passport_jwt                              = require("passport-jwt");
const schemas                                   = require('../../config/database/require_schemas');
const environment                               = require('../../config/environment')
const jwt                                       = require('jsonwebtoken');

var opts = {
  secretOrKey: environment.secret,
  jwtFromRequest: passport_jwt.ExtractJwt.fromAuthHeaderWithScheme('jwt')
};

function verify(jwtPayload, done) {
  var expirationDate = new Date(jwtPayload.exp * 1000) //multiplica por 1000 para vira milisegundos

  if (expirationDate < new Date()) { //verifica se o token expirou
    return done(null, false);
  }else{

    schemas.user()
      .findOne({
        _id: jwtPayload.id
      })
      .then(function (profile) {
        var payload = { id: profile._id };

        if (profile) {
          return done(null, {
            id: profile._id,
            email: profile.email,
            refresh_token: `JWT ${jwt.sign(payload, environment.secret, { expiresIn: environment.expiresIn })}`
          });
        }
        return done(null, false);
      })
      .catch(function (error) {
        done(error, null);
      });
  }

};

function setupAuth(app) {
  app.use(passport.initialize());
  passport.use(new passport_jwt.Strategy(opts, verify));
};

module.exports = setupAuth;
