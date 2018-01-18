const passport                                  = require("passport");
const passport_jwt                              = require("passport-jwt");
const mongoose                                  = require('mongoose');
const profile                                   = mongoose.model('Profile');
mongoose.Promise                                = global.Promise;
const environment                               = require('../../environment')

var opts = {
  secretOrKey: environment.secret,
  jwtFromRequest: passport_jwt.ExtractJwt.fromAuthHeaderWithScheme('jwt')
};

function verify(jwtPayload, done) {

  profile
    .findOne({
      _id: jwtPayload.id
    })
    .then(function(profile) {
      if (profile) {
        return done(null, {
          id: profile._id,
          email: profile.email
        });
      }
      return done(null, false);
    })
    .catch(function(error) {
      done(error, null);
    });
};

function setupAuth(app) {
  app.use(passport.initialize());
  passport.use(new passport_jwt.Strategy(opts, verify));
};

module.exports = setupAuth;
