// routes/auth.js

var express = require('express');
var router = express.Router();
var dotenv = require('dotenv');
dotenv.config();
var url = require('url');
var querystring = require('querystring');

var DB = require('../db');
var db = new DB();
var middle = require('../lib/middleware/headers');
 

async function getModelData(req, res) {
  let ret;
  if(req.query.ids == '*') {
     ret = await db.select(res,['*'], req.query.model)
     res.json({"data" : ret});
  }
}

async function downloadContentQR(req, res) {
  let ret = await db.getContentQR(req.query.ids);
  res.json({"data" : ret});

}

async function downloadUserMessages(req, res) {
  user_mail = req.user.profile._json.email; 
  user_data = await db.select(res, ["id"], "users", {"field" : "email", "condition" : "=", "value" : {'content' : user_mail, 'type': 'string'} })
  console.log(user_data)
  user_id = user_data[0].id
  let ret = await db.getUserMessages(user_id);
  res.json({"data" : ret});

}

router.get('/downloadModel', [middle()], function(req, res){
  getModelData(req, res)
});

router.get('/downloadContentQR', [middle()], function(req, res){
  downloadContentQR(req, res)
});

router.get('/downloadUserMessages', [middle()], function(req, res){
  downloadUserMessages(req, res)
});










module.exports = router;