var OpenPassStrategy = require("../lib/strategy");
var pjson = require("../package.json");
var expect = require("chai").expect;

describe("Strategy", function () {
  var strategy = new OpenPassStrategy(
    {
      clientID: "ABC123",
      clientSecret: "secret",
    },
    function () {}
  );

  it("should be named openpass", function () {
    expect(strategy.name).to.equal("openpass");
  });

  it("should have correct OpenPass SDK headers", function () {
    expect(strategy._oauth2._customHeaders["OpenPass-SDK-Name"]).to.equal("passport-openpass");
    expect(strategy._oauth2._customHeaders["OpenPass-SDK-Version"]).to.equal(pjson.version);
  });

  it("should allow custom headers", function () {
    var strategy2 = new OpenPassStrategy(
      {
        clientID: "ABC123",
        clientSecret: "secret",
        customHeaders: { NewHeader: "HeaderValue" },
      },
      function () {}
    );

    expect(strategy2._oauth2._customHeaders["NewHeader"]).to.equal("HeaderValue");
    expect(strategy2._oauth2._customHeaders["OpenPass-SDK-Name"]).to.equal("passport-openpass");
    expect(strategy2._oauth2._customHeaders["OpenPass-SDK-Version"]).to.equal(pjson.version);
  });

  it("shouldn't allow custom headers to overwrite SDK headers", function () {
    var strategy2 = new OpenPassStrategy(
      {
        clientID: "ABC123",
        clientSecret: "secret",
        customHeaders: { "OpenPass-SDK-Name": "HeaderValue" },
      },
      function () {}
    );

    expect(strategy2._oauth2._customHeaders["OpenPass-SDK-Name"]).to.equal("passport-openpass");
  });
});
