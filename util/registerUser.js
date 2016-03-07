var MongoClient = require('mongodb').MongoClient;
var mongoURL = 'mongodb://root:welovepatterns@ds047692.mongolab.com:47692/production';

var registerUser = function(id, callback) {
  var user = {
    "facebookID": id,
    "tickets": [],
    "notifyOnWatchList": true,
    "notifyOnSubscription": true,
    "maxDistanceForCinema": 10,
    "preferredLanguageSetting": "Don't care",
    "watchlist" : []
  };
  MongoClient.connect(mongoURL, function(err, db) {
    db.collection('users').insertOne(user, function(errorInserting, result) {
      db.close();
      if (errorInserting !== null) {
        callback(errorInserting);
      } else {
        callback(user);
      }
    });
  });
};

module.exports = registerUser;
