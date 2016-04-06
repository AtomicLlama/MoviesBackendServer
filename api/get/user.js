var Method = require('aeolus').Method;
var userGet = new Method();

userGet.onError(require('../../util/registerUser.js'));

userGet.DBWrapper.find('users', function(req) {
  return {
    facebookID: req.getUsername()
  };
}, function(user) {
  return {
    "notifyOnWatchList": user.notifyOnWatchList,
    "notifyOnSubscription": user.notifyOnSubscription,
    "maxDistanceForCinema": user.maxDistanceForCinema,
    "preferredLanguageSetting": user.preferredLanguageSetting
  };
});

userGet.setHasAuth(true);

module.exports = userGet;
