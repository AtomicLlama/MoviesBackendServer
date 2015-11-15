//HTTP Listener

//HTTP Dispatcher that allows us to handle any request

var http = require('http');
var dispatcher = require('httpdispatcher');
var url = require('url');
var ObjectId = require('mongodb').ObjectID;

//Mongo DB Client

var MongoClient = require('mongodb').MongoClient;

var mongoURL = 'mongodb://localhost:27017/test';

http.createServer(function (request, response) {
  dispatcher.dispatch(request, response);
}).listen(80);

var isEmpty = function(value){
    return Boolean(value && typeof value == 'object') && !Object.keys(value).length;
};

var isUserRegistered = function(id, callback) {
  console.log("Checking for user with id: " + id);
  MongoClient.connect(mongoURL, function(err, db) {
    db.collection('users').findOne({"facebookID" : id}, function(error, doc) {
      console.log(doc);
      if (isEmpty(doc) || doc === null || err !== null) {
        db.close();
        console.log("Couldn't Find User");
        console.log(doc);
        console.log(err);
        callback(null);
      } else {
        console.log("Found User!");
        db.close();
        callback(doc);
      }
    });
  });
};

var registerUser = function(user, callback) {
  console.log("Registering User!");
  var mongo = 'mongodb://localhost:27017/test';
  MongoClient.connect(mongoURL, function(err, db) {
    console.log("Connection Established");
    db.collection('users').insertOne(user, function(errorInserting, result) {
      console.log("Inserted!");
      db.close();
      if (errorInserting !== null) {
        console.error(errorInserting);
        callback(errorInserting);
      } else {
        console.log("Inserted: " + result);
        callback(result);
      }
    });
  });
};

dispatcher.onGet("/", function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end("Hello World!");
});

dispatcher.onGet("/user", function(req, res) {
  var queryObject = url.parse(req.url, true);
  var query = queryObject.query;
  var id = query.id;
  var callback = function(data) {
    if (data !== null) {
      console.log("Found a User!");
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(data,0,4));
    } else {
      console.log("Have To Register User");
      var name = "Mathias Quintero";
      var user = {
        "facebookID": id,
        "name": name,
        "tickets": [],
        "notifyOnWatchList": true,
        "notifyOnSubscription": true,
        "maxDistanceForCinema": 10,
        "preferredLanguageSetting": "Don't care",
        "watchlist" : []
      };
      var success = function(response) {
        console.log(response);
        res.writeHead(response !== user ? 200 : 501, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(response,0,4));
      };
      registerUser(user,success);
    }
  };
  isUserRegistered(id, callback);

});

console.log('Server running at http://127.0.0.1:80/');
