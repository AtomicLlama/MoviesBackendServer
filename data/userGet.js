var findUser = require('../util/findUser.js');
var respondWith = require('../util/respondWith.js');

/**
 * Get the settings for a user
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var userGet = function(req, res) {
  var callback = function(data) {
    var map = function(user) {
      return {
        "notifyOnWatchList": user.notifyOnWatchList,
        "notifyOnSubscription": user.notifyOnSubscription,
        "maxDistanceForCinema": user.maxDistanceForCinema,
        "preferredLanguageSetting": user.preferredLanguageSetting
      };
    };
    res.writeHead(200, {'Content-Type': 'application/json'});
    respondWith(res, JSON.stringify(map(data),0,4));
  };
  findUser(callback, req, res);
};

module.exports = userGet;
