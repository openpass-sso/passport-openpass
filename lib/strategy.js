// Load modules.
var OpenIDConnectStrategy = require('passport-openidconnect')
  , util = require('util');


/**
 * `Strategy` constructor.
 *
 * The OpenPass authentication strategy authenticates requests by delegating to
 * OpenPass using the OAuth 2.0 protocol.
 *
 * Options:
 *   - `clientID`      your OpenPass application's client id
 *   - `clientSecret`  your OpenPass application's client secret
 *   - `callbackURL`   URL to which OpenPass will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new OpenPassStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/openpass/callback'
 *       },
 *       function(accessToken, refreshToken, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user);
 *         });
 *       }
 *     ));
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy(options, verify) {
  options = options || {};
  options.issuer = options.issuer || 'https://auth.myopenpass.com';
  options.authorizationURL = options.authorizationURL || 'https://auth.myopenpass.com/v1/api/authorize';
  options.tokenURL = options.tokenURL || 'https://auth.myopenpass.com/v1/api/token';

  OpenIDConnectStrategy.call(this, options, verify);
  this.name = 'openpass';
}

// Inherit from `OpenIDConnectStrategy`.
util.inherits(Strategy, OpenIDConnectStrategy);


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
