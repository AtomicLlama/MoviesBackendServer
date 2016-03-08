var MongoClient = require('mongodb').MongoClient;
var mongoURL = require('./DBUrl.js');
var respondWith = require('./respondWith.js');
var accessDenied = require('./accessDenied.js');
var verifyAuth = require('./authentification.js');
var auth = require('basic-auth');
var isEmpty = require('./isEmpty.js');

/**
 * Will rewrite any user using a mapping function
 * @param  {Request}    req      request
 * @param  {Function}   callback mapping function for the user
 * @param  {Response}   res      response
 * @return {void}                nothing
 */
var rewriteUser = function(req, callback, res) {
  var authdata = auth(req);
  if (authdata) {
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
  } else {
    accessDenied(res);
  }
};

module.exports = rewriteUser;
