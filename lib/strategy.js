var OpenIDConnectStrategy = require("passport-openidconnect");
var util = require("util");
var pjson = require('../package.json');

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
  options.issuer = options.issuer || "https://auth.myopenpass.com";
  options.authorizationURL = options.authorizationURL || "https://auth.myopenpass.com/v1/api/authorize";
  options.tokenURL = options.tokenURL || "https://auth.myopenpass.com/v1/api/token";
  options.userInfoURL = options.userInfoURL || "https://auth.myopenpass.com/v1/api/userinfo";
  options.state = true;

  options.customHeaders = mergeCustomHeaders(options.customHeaders, {
    "OpenPass-SDK-Name": "passport-openpass",
    "OpenPass-SDK-Version": pjson.version
  });

  OpenIDConnectStrategy.call(this, options, verify);

  this.name = "openpass";
}

/**
 * Merges custom headers from two objects. If a key exists in both objects, the value from customHeaders2 will be used.
 * @param customHeaders1
 * @param customHeaders2
 * @returns a merged object containing all key/values from both objects
 */
function mergeCustomHeaders(customHeaders1, customHeaders2) {

  var mergedCustomHeaders = {};
  if (customHeaders1) {
    for (var attrname in customHeaders1) {
      mergedCustomHeaders[attrname] = customHeaders1[attrname];
    }
  }
  if (customHeaders2) {
    for (var attrname in customHeaders2) {
      mergedCustomHeaders[attrname] = customHeaders2[attrname];
    }
  }
  return mergedCustomHeaders;
}

/**
 * Inherits from `OpenIDConnectStrategy`
 */
util.inherits(OpenPassStrategy, OpenIDConnectStrategy);

/**
 * Expose `Strategy`.
 */
module.exports = OpenPassStrategy;
