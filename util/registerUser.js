function register (req, res, error) {
  var user = {
    "facebookID": req.getUsername(),
    "tickets": [],
    "notifyOnWatchList": true,
    "notifyOnSubscription": true,
    "maxDistanceForCinema": 10,
    "preferredLanguageSetting": "Don't care",
    "watchlist" : []
  };
  var DB = require('aeolus').DB;
  DB.insert('users', user, function () {
    res.respondJSON(user);
  }, function (err) {
    res.respondPlainText("Server Error: " + err, 501);
  });
}

module.exports = register;
