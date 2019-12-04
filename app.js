const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require("passport");
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

const User = require('./model/user');

// CONFIG
const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));

// AUTH
// This is an example session
app.use(require("express-session")({
  secret: "He is sent off inside twenty one minutes the forward trusty dog",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MIDDLEWARE
isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  };
};

// MONGOOSE
mongoose.connect("mongodb://localhost/auth_demo", { useNewUrlParser: true });

// ROUTES
// -- Index
app.get('/', (req, res) => {
  res.render("index")
});

// -- Secret Page
// -- render logged in page
app.get('/secret', isLoggedIn, (req, res) => {
  res.render("secret");
});

// -- Auth Routes
// -- Register
// -- render sign up form
app.get('/register', (req, res) => {
  res.render("register");
});

// -- sign up logic
app.post('/register', (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      console.error(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/secret");
    });
  });
});

// -- Login 
// -- render login form
app.get('/login', (req, res) => {
  res.render("login");
});

// -- login logic
// middleware credential check
app.post('/login', passport.authenticate("local", {
  successRedirect: "/secret",
  failureRedirect: "/login"
}), (req, res) => {
});

// -- Logout
// -- logout logic
app.get('/logout', (req, res) => {
  req.lougout();
  res.redirect("/");
});

// SERVER
app.listen(PORT, () => console.log(`Server Running On Port ${PORT}`));
