// routes/auth.js

var express = require('express');
var router = express.Router();
var passport = require('passport');
var dotenv = require('dotenv');
var util = require('util');
var url = require('url');
var querystring = require('querystring');
dotenv.config();

var DB = require('../db');
var db = new DB();
var middle = require('../lib/middleware/headers');

// Perform the login, after login Auth0 will redirect to callback
router.get('/login', passport.authenticate('auth0', {
  scope: 'openid email profile'
}), function (req, res) {
  console.log("LOGINNNNNNNNNN")
  //res.redirect('/');

});




async function createUserAndMessage(req, res) {

  let user_json = req.user.profile._json;
  let exist = await db.userExist(user_json.email)
  console.log(exist)
  if (!exist.registered) {
    let user = await db.createUser(
      res, 
      user_json.given_name,
      user_json.nickname.substring(0,10),
      user_json.email
    );
    console.log("user", user)
    message = {
      /* content_id : {value : id, type : 'number' }, */
      message_user : {
        value: `Welcome to Shacu ${user_json.given_name} see get started if you want need help.`,
        type : 'String' 
      },
      message_type: {
          value: `Registered`,
          type : 'String' 
      },
      user_id :{
        value: user.insertId,
        type : 'String' 
      } 
    }
    await db.insert(res, message, "messages")
  }
}

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', function (req, res, next) {
  console.log("CALLBACK")
  passport.authenticate('auth0', function (err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      //res.redirect(returnTo || '/user');
      createUserAndMessage(req, res);
      
      res.redirect(url.format({
        pathname: process.env.FRONTEND_URL  + "/account/login",
        query: {
          'user' : req.user.profile._raw,
          'tok' : req.user.tok
         }
      }));
    });
  })(req, res, next);
});


// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();

  var returnTo = req.protocol + '://' + req.hostname;
  var port = req.connection.localPort;
  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += ':' + port;
  }
  var logoutURL = new url.URL(
    util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN)
  );
  var searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: process.env.FRONTEND_URL
  });
  logoutURL.search = searchString;
  res.redirect(logoutURL);
});

router.get('/itsLogged', middle(), function(req, res){
  let logged = false
  if(req.user){
    logged = true
  }  
  res.json({"logged" : logged});
});


async function itsAdmin(res, req) {
  let itsAdmin = false
  mail = req.user.profile._json.email;
  itsAdmin = await db.itsAdmin(mail)
  res.json({"its_admin" : itsAdmin});
};

router.get('/itsAdmin', middle(), function(req, res){
  itsAdmin(res, req);
});




module.exports = router;