var auth = require('basic-auth');
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
var verifyAuth = function(user,req, callback) {
  var data = auth(req);
  request(generateURL(data.pass), function(error, response, body) {
    if (!error || error === null) {
      var loggedin = JSON.parse(body).id == data.name;
      callback(loggedin);
    } else {
      callback(false);
    }
  });
};

module.exports = verifyAuth;
