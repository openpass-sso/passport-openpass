var express = require("express");
var passport = require("passport");
var util = require("util");
var session = require("express-session");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var partials = require("express-partials");

// Use the real passport-openpass npm package
//var Strategy = require('passport-openpass').Strategy;

// User when developing the package locally
var Strategy = require("../lib").Strategy;

// var OPENPASS_CLIENT_ID = "--insert-openpass-client-id-here--";
// var OPENPASS_CLIENT_SECRET = "--insert-openpass-client-secret-here--";

var OPENPASS_CLIENT_ID = "619049193c9345f58733b974f536eca0";
var OPENPASS_CLIENT_SECRET =
  "1f25a5bae5e4f0202ce7a7ed4b049e7da780d6845b857c167a0e3c447a3eb716";

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
//   In this example, we use the user object directly.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// Use the OpenPass Strategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and OpenPass
//   profile), and invoke a callback with a user object.
passport.use(
  new Strategy(
    {
      clientID: OPENPASS_CLIENT_ID,
      clientSecret: OPENPASS_CLIENT_SECRET,
      callbackURL: "http://localhost:3020/callback",
    },
    function verify(iss, profile, context, idToken, accessToken, refreshToken, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        // To keep the example simple, the user's OpenPass profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate OpenPass with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
  )
);

var app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(partials());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: false })
);
app.use(express.static(__dirname + "/public"));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", function (req, res) {
  res.render("index", { user: req.user });
});

app.get("/user", ensureAuthenticated, function (req, res) {
  console.log("user", req.user);
  res.render("user", { user: req.user });
});

app.get("/login", function (req, res) {
  res.render("login", { user: req.user });
});

// GET /auth/openpass
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in OpenPass authentication will involve redirecting
//   the user to auth.myopenpass.com.  After authorization, OpenPass will redirect the user
//   back to this application at /callback
app.get(
  "/auth/openpass",
  passport.authenticate("openpass", {}),
  function (req, res) {
    // The request will be redirected to OpenPass for authentication, so this
    // function will not be called.
  }
);

// GET /callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to the home page.
app.get(
  "/callback",
  passport.authenticate("openpass", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

app.get("/logout", function (req, res) {
  req.logout({}, function (err) {
    console.log("logout", err);
  });
  res.redirect("/");
});

app.listen(3020);

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
