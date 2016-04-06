var Method = require('aeolus').Method;
var notifyWatchGet = new Method();

notifyWatchGet.onError(require('../../util/registerUser.js'));

notifyWatchGet.DBWrapper.find('users', function (req) {
  return {
    facebookID: req.getUsername()
  };
},function (user) {
  return user.notifyOnWatchList;
});

notifyWatchGet.setHasAuth(true);

module.exports = notifyWatchGet;
