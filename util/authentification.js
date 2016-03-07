var auth = require('basic-auth');

var verifyAuth = function(user,req) {
  var data = auth(req);
  return user.facebookID === data.pass;
};

module.exports = verifyAuth;
