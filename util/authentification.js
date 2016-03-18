var request = require('request');

var generateURL = function(token) {
  return "https://graph.facebook.com/me?access_token=" + token;
};

/**
 * Check Auth of the request with the user
 * @param  {Object} user  User Object
 * @param  {Request} req  Request
 * @return {void}         Nothing
 */
var verifyAuth = function(user,pass, callback) {
  request(generateURL(pass), function(error, response, body) {
    if (!error || error === null) {
      var loggedin = JSON.parse(body).id == user;
      callback(loggedin);
    } else {
      callback(false);
    }
  });
};

module.exports = verifyAuth;
