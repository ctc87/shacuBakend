var express = require("express");

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
var app = express();
var DB = require('./db');
var Session = require('./session_interface')
var Passport = require('./passport_interface')
var authRouter = require('./routes/auth');
var uploadroutes = require('./routes/upload');
var downloadroutes = require('./routes/download');
var https = require('https');
var fs = require('fs');

const path = require('path') 

var db = new DB();
// the order its importnat
var session = new Session(app);
var passport = new Passport(app);

var options = {
    key: fs.readFileSync(__dirname  + '/server.key', 'utf8'),
    cert: fs.readFileSync(__dirname  + '/server.cert', 'utf8'),
};

// sets port 8080 to default or unless otherwise specified in the environment
app.set('port', process.env.PORT || 8080);


app.use('/', authRouter);
app.use('/', uploadroutes);
app.use('/', downloadroutes);

app.get('/download/:name', function(req, res){
    let name = req.params.name;
    const file = `${__dirname}/uploads/${name}`;
    res.download(file); // Set disposition and send it.
  });



// Only works on 3000 regardless of what I set environment port to or how I set
// [value] in app.set('port', [value]).
// app.listen(3000);
var server = https.createServer(options, app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
  

