require("dotenv").config();
const auth = require("../middleware/auth");
const Register = require("../models/registers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.logoutUser = async (req, res) => {
  
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return jwt.verify(token.token, process.env.SECRET_KEY,(err,data)=>{
        if(!err&&token.token!=req.token)
        {
          return true;
        }
        return false;
      });
    });

    const user = await req.user.save();

    res.status(200).json({ message: "logout Success", user });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

exports.verifyUser = async (req, res) => {

  return res.status(200).json({user:req.user});
  
};

exports.registerUser = async (req, res) => {
  try {
    const userData = new Register({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: req.body.password,
    });

    const token = await userData.getAuthToken();
    res.cookie("jwt", token);
    const registededData = await userData.save();

    console.log(`${req.body.fname} registered succefully `);

    const publicDetails = {
      fname: userData.fname,
      lname: userData.lname,
      _id: userData._id,
    };

    res.json({
      message:
        "You are registered successfully . Please Sign In to access the services",
      user: publicDetails,
    });
  } catch (err) {
    res.status(403).send(err);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Register.findOne({ email });

    const token = await user.getAuthToken();

    res.cookie("jwt", token);

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch == true) {
      const publicDetails = {
        fname: user.fname,
        lname: user.lname,
        _id: user._id,
      };
      res.status(200).json({ isMatch, token, user: publicDetails });
    } else {
      res.status(401).json({ isMatch, err: "incorrect password" });
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ isMatch: false, err: "wrong credentials" });
  }
};
