var MongoClient = require('mongodb').MongoClient;
var mongoURL = require('./DBUrl.js');
var isEmpty = require('./isEmpty.js');

/**
 * Will rewrite any user using a mapping function
 * @param  {Function}   map mapping function for the user
 * @param  {String}     id       id of the user
 * @param  {Function}   callback callback
 * @return {void}                nothing
 */
var rewriteUser = function(map, id, callback) {
  MongoClient.connect(mongoURL, function(err, db) {
    db.collection('users').findOne({"facebookID" : id}, function(error, doc) {
      if (isEmpty(doc) || doc === null || err !== null) {
        db.close();
        throw err;
      } else {
        var newUser = map(doc);
        db.collection('users').save(newUser);
        callback(newUser);
      }
    });
  });
};

module.exports = rewriteUser;
