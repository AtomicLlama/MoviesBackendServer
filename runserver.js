//HTTP Listener

//HTTP Dispatcher that allows us to handle any request

var http = require('http');
var dispatcher = require('httpdispatcher');

// Allowing Delete and Put

dispatcher.listeners.delete = [];
dispatcher.listeners.put = [];

// Data Functions

var userGet = require('./data/userGet.js');
var ticketsGet = require('./data/ticketsGet.js');
var watchlistGet = require('./data/watchlistGet.js');
var subsGet = require('./data/subsGet.js');
var languageGet = require('./data/languageGet.js');
var languagePost = require('./data/languagePost.js');
var distanceGet = require('./data/distanceGet.js');
var distancePost = require('./data/distancePost.js');
var notifyWatchGet = require('./data/notifyWatchGet.js');
var notifyWatchPost = require('./data/notifyWatchPost.js');
var notifySubGet = require('./data/notifySubGet.js');
var notifySubPost = require('./data/notifySubPost.js');
var watchlistPost = require('./data/watchlistPost.js');
var subsPost = require('./data/subsPost.js');
var watchlistDelete = require('./data/watchlistDelete.js');
var subsDelete = require('./data/subsDelete.js');
var showtimeGet = require('./data/showtimeGet.js');

// Main

dispatcher.onGet("/", function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end("Hello World!");
});

// Get Requests

dispatcher.onGet("/user", userGet);
dispatcher.onGet("/tickets", ticketsGet);
dispatcher.onGet("/watchlist", watchlistGet);
dispatcher.onGet("/subs", subsGet);
dispatcher.onGet("/showtimes", showtimeGet);
dispatcher.onGet("/laguage", languageGet);
dispatcher.onGet("/distance", distanceGet);
dispatcher.onGet("/notifySub", notifySubGet);
dispatcher.onGet("/notifyWatch", notifyWatchGet);

// Post Requests

dispatcher.onPost("/watchlist", watchlistPost);
dispatcher.onPost("/subs", subsPost);

// Put Requests

dispatcher.on("put","/language", languagePost);
dispatcher.on("put","/distance", distancePost);
dispatcher.on("put","/notifyWatch", notifyWatchPost);
dispatcher.on("put","/notifySub", notifySubPost);

// Delete Requests

dispatcher.on("delete","/watchlist", watchlistDelete);
dispatcher.on("delete","/subs", subsDelete);

// Start

var port = process.env.PORT || 8080;

http.createServer(function (request, response) {
  dispatcher.dispatch(request, response);
}).listen(port);

console.log('Server running at http://127.0.0.1:' + port);
