const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//creating a new schema
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
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

});

//define generateToken() for token generation
userSchema.methods.generateToken = async function () {
    try {
        const token = await jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY );
        this.tokens = this.tokens.concat({ token:token });
        await this.save();
        return token;
    } catch (error) {
        res.send("The error part" + error);
    }
}

//it is a meddleware , before save() and after the data fatch from form validation
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


// creating a collection
const Register = new mongoose.model("Register", userSchema);

module.exports = Register;