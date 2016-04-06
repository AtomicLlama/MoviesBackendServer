var Method = require('aeolus').Method;
var distanceGet = new Method();

distanceGet.onError(require('../../util/registerUser.js'));

distanceGet.DBWrapper.find('users',function (req) {
  return {
    facebookID: req.getUsername()
  };
}, function (user) {
  return user.maxDistanceForCinema;
});

distanceGet.setHasAuth(true);

module.exports = distanceGet;
