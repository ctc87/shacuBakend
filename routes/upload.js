// routes/auth.js

var express = require('express');

const multer  = require('multer')
storage = multer.diskStorage({
  destination: function (req, file, next) {
    next(null, './uploads')
  },
  filename: function (req, file, next) {
    next(null, file.originalname)
  }
});
upload = multer({ storage: storage });
const bodyParser = require('body-parser');
var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}) );
var passport = require('passport');
var dotenv = require('dotenv');
var util = require('util');
var url = require('url');
var querystring = require('querystring');
dotenv.config();
var cors = require('cors')
var fs = require('fs');
var DB = require('../db');
var db = new DB();
var middle = require('../lib/middleware/headers');
 


 async function insertQR(res, req) {
  let lat, long, content;
  lat =  req.body.lat;
  long = req.body.long;
  qr_name = req.body.qr_name
  qrDBValues = {
    lat : {value : lat, type : 'number' },
    lon : {value : long, type : 'number' },
    qr_name : {value : qr_name, type : 'string' },

    //content : {value : "content" , type : 'string' }
  }
  let qr_id = await db.insert(res, qrDBValues, "qr")
  console.log("qrid", qr_id.insertId)
  qrcode = require('yaqrcode');
  let qr_url = process.env.FRONTEND_URL + '/Content/qr/' + qr_id.insertId;
  console.log(qr_url);
  base64 = qrcode(qr_url, {
      size: 200
  });
  qrDBValues = {
    qr_image : {value : base64, type : 'string' },
  }

  await db.update(res, qrDBValues, "qr", {"field" : "id", "condition" : "=", "value" : {'content' : qr_id.insertId, 'type': 'number'}} )
  await insertContent(res, req, qr_id.insertId);
  
  res.json({"qr" : base64});
  
};

async function insertContent(res, req, _qrid = false) {
  let qr_id, user_data, user_id, file, user_mail, authorized, qr_queue;
  user_mail = req.user.profile._json.email; 
  user_data = await db.select(res, ["id"], "users", {"field" : "email", "condition" : "=", "value" : {'content' : user_mail, 'type': 'string'} })
  console.log(user_data)
  user_id = user_data[0].id
  if(_qrid) {
    qr_id = _qrid;
    qr_queue = 'NULL'
    authorized = true;
  } else  {
    qr_id = 'NULL';
    qr_queue = req.body.qr_id;
    authorized = false;
  }
  file = req.files[0];
  
  contentDBValues = {
    qr_id : {value : qr_id, type : 'number' },
    qr_queue : {value : qr_queue, type : 'number' },
    user_id : {value : user_id, type : 'number' },
    size : {value : file.size, type : 'number' },
    file_path : {value : file.filename, type : 'string' },
    authorized : {value : authorized, type : 'number' },
    content_name : {value : req.body.content_name, type : 'string' },
    content_type : {value : req.body.file_type, type : 'string' },
    content_description : {value : req.body.description, type : 'string' },
  }
  
  let content_id = await db.insert(res, contentDBValues, "content")
  many2many = {
    content_id : {value : content_id.insertId, type : 'number' },
    user_id : {value : user_id, type : 'number' },
  }
  console.log(content_id)
  await db.insert(res, many2many, "content_user")



}


router.all('/uploadQR', [middle(), upload.any('fileUpload')], function(req, res){
  let requestMethod = req.method;  


  if (requestMethod == "OPTIONS") {
    console.log("uploadQR")
    res.json({"option" :'true'});
  } else {
    insertQR(res, req)
  }
  
});

async function uploadContent (res, req) {
  await insertContent(res, req)
  res.json({"qr" : 'base64'});
}

router.all('/uploadContent', [middle(), upload.any('fileUpload')], function(req, res){
  let requestMethod = req.method;  
  if (requestMethod == "OPTIONS") {
    console.log("uploadContent")
    res.json({"option" :'true'});
  } else {
    uploadContent(res, req)
  }
  
});


async function convertDataUpdate(res, req, update_data) {
  console.log("convertDataUpdate", update_data)
  for (let i = 0; i < update_data.data.length; i++) {
    const el = update_data.data[i];
    let where; 
    let DBValues = {}; 
    for (const property in el) {
      if(property != 'id') {
        DBValues[property] = {value: el[property], type : 'number'} 
      } else { 
        where={"field" : property, "condition" : "=", "value" : {'content' : el[property], 'type': 'number'}}
      }
    }
    await db.update(res, DBValues, update_data.table,  where)
  }
  
}

router.all('/update', [middle()], function(req, res){
  let requestMethod = req.method;  
  console.log(requestMethod)
  if (requestMethod == "OPTIONS") {
    res.json({"option" :'true'});
  } else {
    convertDataUpdate(res, req, req.body)
    res.json({"upload" :'true'});
  }
});


async function convertDataDelete(res, req, ids) {
    await db.delete_ids(res, req.body.table, ids)
}
  



router.all('/delete', [middle()], function(req, res){
  let requestMethod = req.method;  
  if (requestMethod == "OPTIONS") {
    res.json({"option" :true});
  } else {
    convertDataDelete(res, req, req.body.ids)
    res.json({"delete" :true});
  }
});

async function exist(res, req, ids) {
   let value = await db.exist(res, req.body.table, ids)
   
   res.json({"exist" :value});
}


router.all('/exist', [middle()], function(req, res){
  let requestMethod = req.method;  
  if (requestMethod == "OPTIONS") {
    res.json({"option" :true});
  } else {
    exist(res, req, req.body.ids)
  }
});





module.exports = router;