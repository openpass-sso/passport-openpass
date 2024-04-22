var express  = require('express')
  , session  = require('express-session')
  , passport = require('passport')
  , Strategy = require('../lib').Strategy
  , app      = express();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new Strategy({
    clientID: '619049193c9345f58733b974f536eca0',
    clientSecret: '1f25a5bae5e4f0202ce7a7ed4b049e7da780d6845b857c167a0e3c447a3eb716',
    callbackURL: 'http://localhost:3020/callback',
}, function(issuer, profile, done) {
    process.nextTick(function() {
        return done(null, profile);
    });
}));

app.use(session({
    secret: 'example-secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', passport.authenticate('openpass', {  }), function(req, res) {});

app.get('/callback',
    passport.authenticate('openpass', { failureRedirect: '/' }, function (err, user, info, status) {
        console.log('user', user);
    }), function (req, res) {
        res.redirect('/info')
    }
);

app.get('/logout', function(req, res) {
    req.logout({}, function (err) {
        if (err) return console.log(err);
        res.redirect('/');
    });
});

app.get('/info', checkAuth, function(req, res) {
    console.log(req.user)
    res.json(req.user);
});

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send('not logged in :(');
}

app.listen(3020, function (err) {
    if (err) return console.log(err)
    console.log('Listening at http://localhost:3020/')
})