var isUserRegistered = require('../util/isUserRegistered.js');
var respondWith = require('../util/respondWith.js');

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
  console.log("Request before: " + req);
  isUserRegistered(callback, req, res);
};

module.exports = userGet;
