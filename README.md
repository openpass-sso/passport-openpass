# passport-openpass

[Passport](https://www.passportjs.org/) strategy for authenticating with
[OpenPass](https://myopenpass.com/) using [OpenID Connect](https://www.passportjs.org/features/openid-connect/).

This module lets you authenticate using OpenPass in your Node.js applications.
By plugging into Passport, Sign In with OpenPass can be easily and unobtrusively
integrated into any application or framework that supports
[Connect](https://github.com/senchalabs/connect#readme)-style middleware,
including [Express](https://expressjs.com/).

<div align="center">

:seedling: [Tutorial](https://www.passportjs.org/tutorials/openpass/?utm_source=github) •

</div>

<div align="right">
  <sup>Developed by <a href="#authors">Chris Riddle</a>.</sub>
</div>

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

#### Configure Strategy

Once you've [registered your application](#register-application), the strategy
needs to be configured with your application's client ID and secret, along with
its OAuth 2.0 redirect endpoint.

The strategy takes a `verify` function as an argument, which accepts `issuer`
and `profile` as arguments.  `issuer` is set to `https://auth.myopenpass.com`,
indicating that the user used OpenPass to log in.
When authenticating a user, this strategy uses
the OpenID Connect protocol to obtain this information via a sequence of
redirects and API requests to OpenPass.

The `verify` function is responsible for determining the user to which the
OpenPass account belongs.  In cases where the account is logging in for the
first time, a new user record is typically created automatically.  On subsequent
logins, the existing user record will be found via its relation to the OpenPass
account.

Because the `verify` function is supplied by the application, the app is free to
use any database of its choosing.  The example below illustrates usage of a SQL
database.

```js
var OpenPassStrategy = require('passport-openpass');

passport.use(new OpenPassStrategy({
    clientID: process.env['OPENPASS_CLIENT_ID'],
    clientSecret: process.env['OPENPASS_CLIENT_SECRET'],
    callbackURL: 'https://www.example.com/oauth2/redirect/openpass'
  },
  function verify(issuer, profile, cb) {
    db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
      issuer,
      profile.id
    ], function(err, cred) {
      if (err) { return cb(err); }
      
      if (!cred) {
        // The account at OpenPass has not logged in to this app before.  Create a
        // new user record and associate it with the OpenPass account.
        db.run('INSERT INTO users (name) VALUES (?)', [
          profile.displayName
        ], function(err) {
          if (err) { return cb(err); }
          
          var id = this.lastID;
          db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
            id,
            issuer,
            profile.id
          ], function(err) {
            if (err) { return cb(err); }
            
            var user = {
              id: id,
              name: profile.displayName
            };
            return cb(null, user);
          });
        });
      } else {
        // The account at OpenPass has previously logged in to the app.  Get the
        // user record associated with the OpenPass account and log the user in.
        db.get('SELECT * FROM users WHERE id = ?', [ cred.user_id ], function(err, user) {
          if (err) { return cb(err); }
          if (!user) { return cb(null, false); }
          return cb(null, user);
        });
      }
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

## Documentation

* [todos-express-openpass](https://github.com/passport/todos-express-openpass)

  Illustrates how to use the OpenPass strategy within an Express application.  For
  developers new to Passport and getting started, a [tutorial](https://www.passportjs.org/tutorials/google/)
  is available.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2021-2023 Jared Hanson