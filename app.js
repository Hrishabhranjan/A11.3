const express =require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");

const session = require('express-session');





var app =express();
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(session({
    secret: "MySecretKey",
    resave: false,
    saveUninitialized: false
}));
const mongoose = require ("mongoose");
mongoose.connect("mongodb://localhost:27017/secrets");
const trySchema = new mongoose.Schema({
    email: String,
    password: String
});
const Item =mongoose.model("second",trySchema);
app.get("/",function(req,res){
    res.render("home");
});
app.post("/register", async function(req, res) {
    try {
        const newuser = new Item({
            email: req.body.username,
            password: req.body.password
        });

        await newuser.save(); 
        res.render("secrets");
    } catch (err) {
        console.error(err);
        res.send("Error registering user.");
    }
});
app.post("/login", async function(req, res) {
    try {
        let username = req.body.username;
        let password = req.body.password;

        const foundUser = await Item.findOne({ email: username });

        if (foundUser && foundUser.password === password) {
            res.render("secrets");
        } else {
            res.send("Invalid credentials.");
        }
    } catch (err) {
        console.error(err);
        res.send("Login error occurred.");
    }
});


app.get("/secrets", function(req, res){
    if (req.session.user) {
        res.render("secrets");
    } else {
        res.redirect("/login");
    }
});



app.get("/login",function(req,res){
res.render("login");
});
app.get("/register",function(req,res){
res.render("register");
});
app.get("/logout", function(req, res){
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/login");
        }
    });
});


app.listen(8000,function(){
    console.log("Server Started");
});