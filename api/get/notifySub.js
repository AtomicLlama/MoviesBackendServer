var Method = require('aeolus').Method;
var notifySubGet = new Method();

notifySubGet.onError(require('../../util/registerUser.js'));

notifySubGet.DBWrapper.find('users', function (req) {
  return {
    facebookID: req.getUsername()
  };
},function (user) {
  return user.notifyOnSubscription;
});

notifySubGet.setHasAuth(true);

module.exports = notifySubGet;
