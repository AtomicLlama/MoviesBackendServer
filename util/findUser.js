var MongoClient = require('mongodb').MongoClient;
var auth = require('basic-auth');
var mongoURL = require('./DBUrl.js');
var respondWith = require('./respondWith.js');
var accessDenied = require('./accessDenied.js');
var verifyAuth = require('./authentification.js');
var registerUser = require('./registerUser.js');
var isEmpty = require('./isEmpty.js');

/**
 * will find a User in the database
 * @param  {Function} callback callback on what to do with the user
 * @param  {[Request]}    req     request
 * @param  {[Response]}   res     response
 * @return {[void]}               void
 */
var findUser = function(callback, req, res) {
  var authdata = auth(req);
  if (authdata) {
    var id = authdata.name;
    MongoClient.connect(mongoURL, function(err, db) {
      db.collection('users').findOne({"facebookID" : id}, function(error, doc) {
        if (isEmpty(doc) || doc === null || err !== null) {
          db.close();
          registerUser(id,callback);
        } else {
          db.close();
          verifyAuth(doc,req,function(valid) {
            if (valid) {
              callback(doc);
            } else {
              accessDenied(res);
            }
          });
        }
      });
    });
  } else {
    accessDenied(res);
  }
};

module.exports = findUser;
