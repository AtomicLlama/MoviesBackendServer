var MongoClient = require('mongodb').MongoClient;
var mongoURL = require('./DBUrl.js');
var registerUser = require('./registerUser.js');
var isEmpty = require('./isEmpty.js');

/**
 * will find a User in the database
 * @param  {Function} callback callback on what to do with the user
 * @param  {[String]}    id    id of the user
 * @return {[void]}               void
 */
var findUser = function(callback,id) {
  MongoClient.connect(mongoURL, function(err, db) {
    db.collection('users').findOne({"facebookID" : id}, function(error, doc) {
      if (isEmpty(doc) || doc === null || err !== null) {
        db.close();
        registerUser(id,callback);
      } else {
        db.close();
        callback(doc);
      }
    });
  });
};

module.exports = findUser;
