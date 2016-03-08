var auth = require('basic-auth');

/**
 * Check Auth of the request with the user
 * @param  {Object} user  User Object
 * @param  {Request} req  Request
 * @return {void}         Nothing
 */
var verifyAuth = function(user,req) {
  var data = auth(req);
  return user.facebookID === data.pass;
};

module.exports = verifyAuth;
