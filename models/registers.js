const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email address");
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//password hashing
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

//token generation
userSchema.methods.getAuthToken = async function () {
    try {
        const token = jwt.sign(
            { _id: this._id },
            process.env.SECRET_KEY,
            {
                expiresIn: process.env.expiresIn
            }
        );

        this.tokens = await this.tokens.concat({ token: token });
        const data = await this.save();
        return token;
    } catch (err) {
        console.log("error from auth");
        console.log(err);
    }
}

const Register = new mongoose.model("Register", userSchema);

module.exports = Register;