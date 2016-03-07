var MongoClient = require('mongodb').MongoClient;
var auth = require('basic-auth');
var mongoURL = 'mongodb://root:welovepatterns@ds047692.mongolab.com:47692/production';

var respondWith = require('./respondWith.js');
var accessDenied = require('./accessDenied.js');
var verifyAuth = require('./authentification.js');
var registerUser = require('./registerUser.js');
var isEmpty = require('./isEmpty.js');

var isUserRegistered = function(callback, req, res) {
  console.log("Request: " + req);
  console.log("Auth: " + auth);
  var authdata = auth(req);
  console.log("Data: " + authdata);
  var id = authdata.name;
  MongoClient.connect(mongoURL, function(err, db) {
    db.collection('users').findOne({"facebookID" : id}, function(error, doc) {
      if (isEmpty(doc) || doc === null || err !== null) {
        db.close();
        registerUser(id,callback);
      } else {
        db.close();
        if (verifyAuth(doc,req)) {
          callback(doc);
        } else {
          accessDenied(res);
        }
      }
    });
  });
};

module.exports = isUserRegistered;
