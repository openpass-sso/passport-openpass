/* global describe, it, expect */
/* jshint expr: true */

var OpenPassStrategy = require('../lib/strategy')
  , chai = require('chai');


describe('Strategy', function() {
  
  it('should construct', function() {
    var strategy = new OpenPassStrategy({
      clientID: 's6BhdRkqt3',
      clientSecret: 'some_secret12345'
    }, function() {});
    
    expect(strategy.name).to.equal('openpass');
    expect(strategy._issuer).to.equal('https://auth.myopenpass.com');
    expect(strategy._oauth2._authorizeUrl).to.equal('https://auth.myopenpass.com/v1/api/authorize');
    expect(strategy._oauth2._accessTokenUrl).to.equal('https://auth.myopenpass.com/v1/api/token');
  }); // should construct
  
});