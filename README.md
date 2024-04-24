# passport-openpass

[Passport](http://passportjs.org/) strategy for authenticating with [OpenPass](https://myopenpass.com/)
using [OpenID Connect](https://www.passportjs.org/features/openid-connect/).

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

The OpenPass authentication strategy authenticates users using OpenPass. The strategy requires a verify callback, which accepts these credentials and calls done providing a user profileuser, as well as options specifying a client ID, client secret, and callback URL.

```js
var OpenPassStrategy = require('passport-openpass');

passport.use(new OpenPassStrategy({
    clientID: process.env['OPENPASS_CLIENT_ID'],
    clientSecret: process.env['OPENPASS_CLIENT_SECRET'],
    callbackURL: 'https://www.example.com/oauth2/redirect/openpass'
  },
  function verify(iss, profile, context, idToken, accessToken, refreshToken, done) {
    console.log(profile.id);
    // 
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

## Examples

For a complete example, refer to the [login example](https://github.com/cfsghost/passport-openpass/tree/master/example).

## Tests

```shell
$ npm install --dev
$ make test
```

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)
