// imports 
const config = require('config'); // created file
const jwt = require('jsonwebtoken'); // token generator
const Joi = require('joi'); // Function validation
const mongoose = require('mongoose');  // Manage mongoDB 


const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        requiered : true,
        minlength : 3,
        maxlength : 50
    },
    email : {
        type: String,
        requiered : true,
        minlength : 5,
        maxlength : 255,
        unique : true
    },
    password : {
        type: String,
        requiered : true,
        minlength : 3,
        maxlength : 255
    },
    isAdmin : Boolean // controls different acces user or admin
})

// generate auth token
UserSchema.methods.generateAuthToken = function() { 
    const token = jwt.sign(
        { _id: this._id, isAdmin: this.isAdmin },
        /*
         Carga útil La segunda parte del token es la carga útil, 
         que contiene los reclamos. Las reclamaciones son declaraciones
         sobre una entidad (típicamente, el usuario) y datos adicionales. 
         Hay tres tipos de reclamos: reclamos registrados, públicos y privados.
        */
        config.get('myprivatekey') //get the private key from the config file -> environment variable
    ); 
    
    return token;
  }

  const User = mongoose.model('User', UserSchema);// Instanciate schema in object to export it

//function to validate user cheeck if the user data its correct  wirh the contraints defined
function validateUser(user) {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(3).max(255).required()
    };
    return Joi.validate(user, schema);
}
// exports object and fuction to use from orher file
exports.User = User; 
exports.validate = validateUser;