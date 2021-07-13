const jwt = require("jsonwebtoken")
const Register = require("../models/registers");

//to verify whethear user is logged in or not 
const auth = async (req, res, next) => {

    try {
        const token = req.cookies.jwt;

        const verifyUser = jwt.verify(
            token,
            process.env.SECRET_KEY
        );

        const user = await Register.findOne({ _id: verifyUser._id });

        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        res.status(401).send(err);
    }
}

module.exports = auth;