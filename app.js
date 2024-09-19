require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//database connection
require("./db/conn");

//module getting (database module)
const Register = require("./models/userRegister");
const { json } = require("express");
const { Collection } = require("mongoose");
const { error } = require("console");

//to create a port number 
const port = process.env.PORT || 3000;


//connect a index file 
const staticPath = path.join(__dirname, "../public");
app.use(express.static(staticPath));

//connect a index file 
const templatespath = path.join(__dirname, "../templates/views");
const partialspath = path.join(__dirname, "../templates/partials");
app.use(express.static(templatespath));

//data fatching database
app.use(express.json());
//basically this is used to get method on (means everthing you writen in the form then you get the data)
app.use(express.urlencoded({ extended: false }));

// console.log(path.join(__dirname, "../public"))  // its knowing the path of public file

app.set("view engine", "hbs");
app.set("views", templatespath);
hbs.registerPartials(partialspath);

//main page(root page)
app.get('/', (req, res) => {
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("register");
})
//create a new user in a database and Push the mongo database
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;

        //it is geeting the data from the form(interface form)
        const userInfo = new Register({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: password
        });

        //middelware used to ganertate the token
        const token = await userInfo.generateToken();

        //Add token in website cookie
        res.cookie("jwt", token, {
            httpOnly: true
        });

        //save data to database
        const registeredUser = await userInfo.save();
        res.status(201).render("index");

    } catch (error) {
        res.status(400).send(error);
    }
});
app.get("/login", (req, res) => {
    res.render("login");
});

//login validate(through post method means fathch the data from the database) login click
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userEmail = await Register.findOne({ email: email });
        const isMatch = bcrypt.compare(password, userEmail.password);

        const token = await userEmail.generateToken();
        console.log("token is " + token);

        if (isMatch) {
            res.status(200).render("index");
        }
        else {
            res.status(400).send("invalid password");
        }
    } catch (error) {
        res.send("invalid login details");
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});