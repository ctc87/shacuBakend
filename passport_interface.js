// passport_interface.js

// Load environment variables from .env
var dotenv = require('dotenv');
dotenv.config();

// Load Passport
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');
// ========



function Passport(app) {
    let strategy = new Auth0Strategy(
        {
          domain: process.env.AUTH0_DOMAIN,
          clientID: process.env.AUTH0_CLIENT_ID,
          clientSecret: process.env.AUTH0_CLIENT_SECRET,
          callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://192.168.1.58:8080/callback'
        },
        function (accessToken, refreshToken, extraParams, profile, done) {
          // accessToken is the token to call Auth0 API (not needed in the most cases)
          // extraParams.id_token has the JSON Web Token
          // profile has all the information from the user
          console.log(accessToken)
          console.log(profile)
          profile = {'profile':profile, 'tok': {'acces' :accessToken, 'json' :extraParams.id_token}}
          return done(null, profile);
        }
      );
      
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
    
    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.use(strategy);

    app.use(passport.initialize());
    app.use(passport.session());
}


module.exports = Passport;

