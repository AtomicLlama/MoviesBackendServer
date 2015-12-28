//HTTP Listener

//HTTP Dispatcher that allows us to handle any request

var http = require('http');
var dispatcher = require('httpdispatcher');
var url = require('url');
var ObjectId = require('mongodb').ObjectID;
var Showtimes = require('showtimes');
var request = require('request');

// var localtunnel = require('localtunnel');
//
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

var port = process.env.PORT || 8080;

http.createServer(function (request, response) {
  dispatcher.dispatch(request, response);
}).listen(port);

var respondWith = function(res, item) {
  res.writeHead(200, {'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  });
  res.end(item);
};

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

var rewriteAttributeForUser = function(id, callback, res) {
  MongoClient.connect(mongoURL, function(err, db) {
    db.collection('users').findOne({"facebookID" : id}, function(error, doc) {
      if (isEmpty(doc) || doc === null || err !== null) {
        db.close();
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end("Wasn't able to rewrite it. Perhaps there is no user with that id");
      } else {
        var newUser = callback(doc);
        db.collection('users').save(newUser);
        db.close();
        respondWith(res, JSON.stringify(newUser,0,4));
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
      respondWith(res, JSON.stringify(data,0,4));
    } else {
      var user = {
        "facebookID": id,
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
      respondWith(res, JSON.stringify(tickets,0,4));
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
      respondWith(res, JSON.stringify(movies,0,4));
    } else {
      res.writeHead(404, {'Content-Type': 'application/json'});
      res.end("No Watchlist Available For User. Check if user is registered!");
    }
  };
  isUserRegistered(id, callback);
});

dispatcher.onGet("/showtimes", function(req,res) {
  var queryObject = url.parse(req.url, true);
  var query = queryObject.query;
  var lat = query.lat;
  var lon = query.lon;
  var movie = query.movie;
  var timesAPI = new Showtimes(lat + "," + lon, {});
  try {
    request("https://api.themoviedb.org/3/movie/" + movie + "/alternative_titles?api_key=18ec732ece653360e23d5835670c47a0",function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var alternatives = JSON.parse(body).titles;
        var names = alternatives.map(function (item) {
          return item.title;
        });
        request("https://api.themoviedb.org/3/movie/" + movie + "?api_key=18ec732ece653360e23d5835670c47a0",function (error, response, body) {
          names.push(JSON.parse(body).original_title);
          var allowed = names.reduce(function(array, title) {
            return array.concat(title.split(": "));
          },[]);
          timesAPI.getTheaters(function(err, response) {
            if (err === null) {
              var theatresShowingMovie = response.filter(function(theatre) {
                for (var j in theatre.movies) {
                  var item = theatre.movies[j];
                  var namesForMovie = item.name.split(": ").map(function(item) {
                    return item.replace(/ *\([^)]*\) */g, "");
                  });
                  for (var i in namesForMovie) {
                    if (allowed.indexOf(namesForMovie[i]) > -1) {
                      return true;
                    }
                  }
                }
              });
              var returnableResponse = theatresShowingMovie.map(function (theatre) {
                for (var j in theatre.movies) {
                  var item = theatre.movies[j];
                  var namesForMovie = item.name.split(": ").map(function(item) {
                    return item.replace(/ *\([^)]*\) */g, "");
                  });
                  for (var i in namesForMovie) {
                    if (allowed.indexOf(namesForMovie[i]) > -1) {
                      return {
                        name: theatre.name,
                        address: theatre.address,
                        showtimes: item.showtimes,
                        film: item.name
                      };
                    }
                  }
                }
              });
              if (err === null && returnableResponse.length > 0) {
                respondWith(res, JSON.stringify(returnableResponse,0,4));
              } else {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end("No theatres");
              }
            } else {
              res.writeHead(404, {'Content-Type': 'application/json'});
              res.end(err);
            }
          });
        });
      }
    });
  } catch(err) {
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end(err);
  }
});

dispatcher.onPost("/language", function(req, res) {
  var queryObject = url.parse(req.url, true);
  var query = queryObject.query;
  var id = query.userid;
  try {
    var pref = query.pref;
    rewriteAttributeForUser(id, function(user){
      user.preferredLanguageSetting = pref;
      return user;
    },res);
  } catch (e) {
    res.writeHead(501, {'Content-Type': 'application/json'});
    res.end("You need to specify what setting to add through the query.");
  }
});

dispatcher.onPost("/distance", function(req, res) {
  var queryObject = url.parse(req.url, true);
  var query = queryObject.query;
  var id = query.userid;
  try {
    var pref = query.pref;
    rewriteAttributeForUser(id, function(user){
      user.maxDistanceForCinema = pref;
      return user;
    },res);
  } catch (e) {
    res.writeHead(501, {'Content-Type': 'application/json'});
    res.end("You need to specify what setting to add through the query.");
  }
});

dispatcher.onPost("/notifyWatch", function(req, res) {
  var queryObject = url.parse(req.url, true);
  var query = queryObject.query;
  var id = query.userid;
  try {
    var pref = query.pref !== "0";
    rewriteAttributeForUser(id, function(user){
      user.notifyOnWatchList = pref;
      return user;
    },res);
  } catch (e) {
    res.writeHead(501, {'Content-Type': 'application/json'});
    res.end("You need to specify what setting to add through the query.");
  }
});

dispatcher.onPost("/notifySub", function(req, res) {
  var queryObject = url.parse(req.url, true);
  var query = queryObject.query;
  var id = query.userid;
  try {
    var pref = query.pref !== "0";
    rewriteAttributeForUser(id, function(user){
      user.notifyOnSubscription = pref;
      return user;
    },res);
  } catch (e) {
    res.writeHead(501, {'Content-Type': 'application/json'});
    res.end("You need to specify what setting to add through the query.");
  }
});

dispatcher.onPost("/watchlist", function(req, res) {
  var queryObject = url.parse(req.url, true);
  var query = queryObject.query;
  var id = query.userid;
  try {
    var movie = query.movie;
    var shouldDelete = false;
    if (query.remove) {
      console.log("Query: " + query.remove);
      shouldDelete = query.remove !== "0";
      console.log("shouldDelete: " + shouldDelete);
    }
    rewriteAttributeForUser(id, function(user){
      var watchlist = user.watchlist;
      var newWatchlist = [];
      for (var i = 0;i<watchlist.length;i++) {
        if (watchlist[i] != movie) {
          newWatchlist.push(watchlist[i]);
        }
      }
      if (!shouldDelete) {
        newWatchlist.push(movie);
      }
      user.watchlist = newWatchlist;
      return user;
    },res);
  } catch (e) {
    res.writeHead(501, {'Content-Type': 'application/json'});
    res.end("You need to specify what setting to add through the query.");
  }
});




console.log('Server running at http://127.0.0.1:80/');
