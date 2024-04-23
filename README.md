# passport-openpass

[Passport](https://www.passportjs.org/) strategy for authenticating with
[OpenPass](https://myopenpass.com/) using [OpenID Connect](https://www.passportjs.org/features/openid-connect/).

This module lets you authenticate using OpenPass in your Node.js applications.

## Install

```sh
$ npm install passport-openpass
```

## Usage

#### Register Application

The OpenPass strategy authenticates users using their OpenPass account.  Before your
application can make use of OpenPass's authentication system, you must first
register your app with OpenPass.  Once registered, a client ID and secret will be
issued which are used by OpenPass to identify your app.

```js
var OpenPassStrategy = require('passport-openpass');

passport.use(new OpenPassStrategy({
    clientID: process.env['OPENPASS_CLIENT_ID'],
    clientSecret: process.env['OPENPASS_CLIENT_SECRET'],
    callbackURL: 'https://www.example.com/oauth2/redirect/openpass'
  },
  function verify(issuer, profile, cb) {
    console.log(profile.id);
    });
  }
));
```

#### Define Routes

Two routes are needed in order to allow users to log in with their OpenPass
account.  The first route redirects the user to the OpenPass, where they will
authenticate:

```js
app.get('/login/openpass', passport.authenticate('openpass'));
```

The second route processes the authentication response and logs the user in,
after OpenPass redirects the user back to the app:

```js
app.get('/oauth2/redirect/openpass',
  passport.authenticate('openpass', { failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
    res.redirect('/');
  });
```

## License

[The MIT License](http://opensource.org/licenses/MIT)