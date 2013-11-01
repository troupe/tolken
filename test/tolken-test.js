var assert    = require('assert');
var tolken  = require('..');

describe('tolken', function() {

  it('should valid correct client tokens', function(done) {
    var id = '123456';
    var jwtSecret = 'grumpycat';

    tolken.generate(id, jwtSecret, function(err, details) {
      if(err) return done(err);

      assert(details, 'Expected a token');
      assert(details.id, 'Expected id');
      assert(details.clientToken, 'Expected clientToken');
      assert(details.serverToken, 'Expected serverToken');

      assert.equal(tolken.extractIdFromClientToken(details.clientToken, jwtSecret), '123456', 'Expected the original ID');

      tolken.verifyClientToken(details.clientToken, details.serverToken, jwtSecret, function(match) {
        assert(match, 'Expected details to match');
        done();
      });
    });

  });


  it('should not handle extractIdFromClientToken for invalid tokens', function(done) {
    var id = '123456';
    var jwtSecret = 'grumpycat';

    tolken.generate(id, jwtSecret, function(err, details) {
      if(err) return done(err);

      assert.equal(tolken.extractIdFromClientToken(details.clientToken + 'x', jwtSecret), undefined, 'Expected the original ID');
      done();
    });

  });

  it('should not handle mismatching tokens', function(done) {
    var id1 = '123456';
    var id2 = '456789';
    var jwtSecret = 'grumpycat';

    tolken.generate(id1, jwtSecret, function(err, details1) {
      if(err) return done(err);

      tolken.generate(id2, jwtSecret, function(err, details2) {
        if(err) return done(err);

        tolken.verifyClientToken(details1.clientToken, details2.serverToken, jwtSecret, function(match) {
          assert(!match, 'Expected details to match');
          done();
        });

      });

    });

  });

});
