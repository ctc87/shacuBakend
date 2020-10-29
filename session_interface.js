// session_interface.js
var session = require('express-session');
var random = require('random-key-generator'); 
// ========



function Session(app) {

    this.sess = {
        secret: random(),
        cookie: {},
        resave: false,
        saveUninitialized: true
    };

    if (app.get('env') === 'production') {
        // Use secure cookies in production (requires SSL/TLS)
        this.sess.cookie.secure = true;
      
        // Uncomment the line below if your application is behind a proxy (like on Heroku)
        // or if you're encountering the error message:
        // "Unable to verify authorization request state"
        // app.set('trust proxy', 1);
      }
      
      app.use(session(this.sess));
}

module.exports = Session;

