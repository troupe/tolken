/* jshint node:true, unused:true */
"use strict";

var jwt = require('jwt-simple');
var crypto = require('crypto');
var sechash = require('sechash');

var SECRET_LENGTH_BYTES = 12;
var SECURE_HASH_OPTS = {
  algorithm: 'sha1',
  iterations: 2000,
  /* salt: use default salt generator */
};

exports.generate = function(id, jwtSecret, callback) {
  crypto.randomBytes(SECRET_LENGTH_BYTES, function(err, buf) {
    if(err) return callback(err);

    var secret = buf.toString('base64');

    var payload = { id: id, secret: secret };

    var token = jwt.encode(payload, jwtSecret);

    sechash.strongHash(secret, SECURE_HASH_OPTS, function(err, hash3) {
      if(err) return callback(err);

      callback(null, { id: id, clientToken: token, serverToken: hash3 });
    });

  });


};

exports.extractIdFromClientToken = function(clientToken, jwtSecret) {
  try {
    var token = jwt.decode(clientToken, jwtSecret);
    return token && token.id;
  } catch(e) {
    return undefined;
  }
};

exports.verifyClientToken = function(clientToken, serverToken, jwtSecret, callback) {
  var token;
  try {
    token = jwt.decode(clientToken, jwtSecret);
  } catch(e) {
  }

  if(!token) return callback(false);

  sechash.testHash(token.secret, serverToken, SECURE_HASH_OPTS, function(err, match) {
    if(err) return callback(false);
    callback(match);
  });

};

