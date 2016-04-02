var MongoClient = require('mongodb').MongoClient;
var mongoURL = 'mongodb://root:welovepatterns@ds047692.mongolab.com:47692/production';

/**
 * Register a user with the id
 * @param  {String}   id       id of the new user
 * @param  {Function} callback function to be called after registration
 * @return {void}              nothing
 */
var registerUser = function(id, callback) {
  var user = {
    "facebookID": id,
    "tickets": [],
    "notifyOnWatchList": true,
    "notifyOnSubscription": true,
    "maxDistanceForCinema": 10,
    "preferredLanguageSetting": "Don't care"
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
