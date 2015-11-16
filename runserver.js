//HTTP Listener

//HTTP Dispatcher that allows us to handle any request

var http = require('http');
var dispatcher = require('httpdispatcher');
var url = require('url');
var ObjectId = require('mongodb').ObjectID;
// var localtunnel = require('localtunnel');
//
// var tunnel = localtunnel(8080,{"port":8080, "subdomain": "movies"}, function(err, tunnel) {
//     if (err === null ) {
//       console.log("New Tunnel Assigned!: " + tunnel.url);
//     } else {
//       console.log("Error:  " + err);
//     }
// });

//Mongo DB Client

var MongoClient = require('mongodb').MongoClient;

var mongoURL = 'mongodb://root:welovepatterns@ds047692.mongolab.com:47692/production';

http.createServer(function (request, response) {
  dispatcher.dispatch(request, response);
}).listen(80);

var isEmpty = function(value){
    return Boolean(value && typeof value == 'object') && !Object.keys(value).length;
};

var isUserRegistered = function(id, callback) {
  MongoClient.connect(mongoURL, function(err, db) {
    console.log(err);
    db.collection('users').findOne({"facebookID" : id}, function(error, doc) {
      if (isEmpty(doc) || doc === null || err !== null) {
        db.close();
        callback(null);
      } else {
        db.close();
        callback(doc);
      }
    });
  });
};

var registerUser = function(user, callback) {
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

dispatcher.onGet("/", function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end("Hello World!");
});

dispatcher.onGet("/user", function(req, res) {
  var queryObject = url.parse(req.url, true);
  var query = queryObject.query;
  var id = query.userid;
  console.log("Query ID = " + id);
  var callback = function(data) {
    if (data !== null) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(data,0,4));
    } else {
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
        res.writeHead(response !== user ? 200 : 501, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(response,0,4));
      };
      registerUser(user,success);
    }
  };
  isUserRegistered(id, callback);
});

dispatcher.onGet("/tickets", function(req, res) {
  var queryObject = url.parse(req.url, true);
  var query = queryObject.query;
  var id = query.userid;
  var callback = function(data) {
    if (data !== null) {
      var tickets = data.tickets;
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(tickets,0,4));
    } else {
      res.writeHead(404, {'Content-Type': 'application/json'});
      res.end("No Tickets Available For User");
    }
  };
  isUserRegistered(id, callback);
});

dispatcher.onGet("/watchlist", function(req, res) {
  var queryObject = url.parse(req.url, true);
  var query = queryObject.query;
  var id = query.userid;
  var callback = function(data) {
    if (data !== null) {
      var movies = data.watchlist;
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(movies,0,4));
    } else {
      res.writeHead(404, {'Content-Type': 'application/json'});
      res.end("No Watchlist Available For User. Check if user is registered!");
    }
  };
  isUserRegistered(id, callback);
});

dispatcher.onPost("/watchlist", function(req, res) {
  var queryObject = url.parse(req.url, true);
  var query = queryObject.query;
  var id = query.userid;
  var movie = query.movie;
  var callback = function(data) {
    if (data !== null) {
      var tickets = data.tickets;
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(tickets,0,4));
    } else {
      res.writeHead(404, {'Content-Type': 'application/json'});
      res.end("No Tickets Available For User");
    }
  };
  isUserRegistered(id, callback);
});

console.log('Server running at http://127.0.0.1:80/');