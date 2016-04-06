var Method = require('aeolus').Method;
var ticketsGet = new Method();

ticketsGet.onError(require('../../util/registerUser.js'));

ticketsGet.DBWrapper.find('users', function(req) {
  return {
    facebookID: req.getUsername()
  };
}, function (user) {
  return user.tickets;
});

ticketsGet.setHasAuth(true);

module.exports = ticketsGet;
