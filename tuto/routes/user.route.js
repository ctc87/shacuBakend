const auth = require("../middleware/auth"); // middleware require
const bcrypt = require("bcrypt"); // encrypt some data
const { User, validate } = require("../models/user.model"); //data model require
const express = require("express"); 
const router = express.Router();


router.get("/current", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
});

router.post("/", async (req, res) => {
    console.log("CONECT")
    // validate the request body first
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    //find an existing user
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");
  
    console.log("CONECT1")
    user = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email
    });
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    
    console.log("CONECT2")
    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send({
      _id: user._id,
      name: user.name,
      email: user.email
    });
    
    console.log("CONECT3")
  });
  
  module.exports = router;