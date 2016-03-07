var MongoClient = require('mongodb').MongoClient;
var mongoURL = 'mongodb://root:welovepatterns@ds047692.mongolab.com:47692/production';
var respondWith = require('./respondWith.js');
var accessDenied = require('./accessDenied.js');
var verifyAuth = require('./authentification.js');
var auth = require('basic-auth');
var isEmpty = require('./isEmpty.js');

var rewriteAttributeForUser = function(req, callback, res) {
  var authdata = auth(req);
  var id = authdata.name;
  MongoClient.connect(mongoURL, function(err, db) {
    db.collection('users').findOne({"facebookID" : id}, function(error, doc) {
      if (isEmpty(doc) || doc === null || err !== null) {
        db.close();
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end("Wasn't able to rewrite it. Perhaps there is no user with that id");
      } else {
        if (verifyAuth(doc,req)) {
          var newUser = callback(doc);
          db.collection('users').save(newUser);
          db.close();
          respondWith(res, JSON.stringify(newUser,0,4));
        } else {
          accessDenied(res);
        }
      }
    });
  });
};

module.exports = rewriteAttributeForUser;
