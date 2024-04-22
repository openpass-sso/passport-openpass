var OpenIDConnectStrategy = require('passport-openidconnect');
var util = require('util');


/**
 * The OpenPass authentication strategy authenticates requests by delegating to OpenPass using OIDC
 *
 * Options:
 *   - `clientID`      your OpenPass application's client id
 *   - `clientSecret`  your OpenPass application's client secret (optional)
 *   - `redirectUri`   URL to which OpenPass will redirect the user after user sign-in
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function OpenPassStrategy(options, verify) {
  options = options || {};
  options.issuer = options.issuer || 'https://auth.myopenpass.com';
  options.authorizationURL = options.authorizationURL || 'https://auth.myopenpass.com/v1/api/authorize';
  options.tokenURL = options.tokenURL || 'https://auth.myopenpass.com/v1/api/token';
  options.userInfoURL = options.userInfoURL || 'https://auth.myopenpass.com/v1/api/userinfo';
  options.state = true;

  OpenIDConnectStrategy.call(this, options, verify);

  this.name = 'openpass';
}

/**
 * Inherits from `OpenIDConnectStrategy`
 */
util.inherits(OpenPassStrategy, OpenIDConnectStrategy);

/**
 * Expose `Strategy`.
 */
module.exports = OpenPassStrategy;