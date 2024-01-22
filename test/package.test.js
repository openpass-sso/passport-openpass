/* global describe, it, expect */

var strategy = require('..');

describe('passport-openpass', function() {
  
  it('should export Strategy constructor as module', function() {
    expect(strategy).to.be.a('function');
    expect(strategy).to.equal(strategy.Strategy);
  });
  
  it('should export Strategy constructor', function() {
    expect(strategy.Strategy).to.be.a('function');
  });
  
});
