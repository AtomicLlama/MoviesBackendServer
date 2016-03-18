var Method = require('Aeolus').Method;
var findUser = require('../../util/findUser.js');

/**
 * Get the settings for a user
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var userGet = new Method();

userGet.handle(function(req, res) {
  var callback = function(data) {
    var map = function(user) {
      return {
        "notifyOnWatchList": user.notifyOnWatchList,
        "notifyOnSubscription": user.notifyOnSubscription,
        "maxDistanceForCinema": user.maxDistanceForCinema,
        "preferredLanguageSetting": user.preferredLanguageSetting
      };
    };
    res.respondJSON(map(data));
  };
  findUser(callback, req.getUsername());
});

userGet.setHasAuth(true);

module.exports = userGet;
