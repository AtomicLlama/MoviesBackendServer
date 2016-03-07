//HTTP Listener

//HTTP Dispatcher that allows us to handle any request

var http = require('http');
var dispatcher = require('httpdispatcher');
var url = require('url');
var request = require('request');
var auth = require('basic-auth');

// Allowing Delete and Put

dispatcher.listeners.delete = [];
dispatcher.listeners.put = [];

// Data Functions

var userGet = require('./data/userGet.js');
var ticketsGet = require('./data/ticketsGet.js');
var watchlistGet = require('./data/watchlistGet.js');
var languagePost = require('./data/languagePost.js');
var distancePost = require('./data/distancePost.js');
var notifyWatchPost = require('./data/notifyWatchPost.js');
var notifySubPost = require('./data/notifySubPost.js');
var watchlistPost = require('./data/watchlistPost.js');
var watchlistDelete = require('./data/watchlistDelete.js');
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
dispatcher.onGet("/showtimes", showtimeGet);

// Post Requests

dispatcher.onPost("/watchlist", watchlistPost);

// Put Requests

dispatcher.on("put","/language", languagePost);
dispatcher.on("put","/distance", distancePost);
dispatcher.on("put","/notifyWatch", notifyWatchPost);
dispatcher.on("put","/notifySub", notifySubPost);

// Delete Requests

dispatcher.on("delete","/watchlist", watchlistDelete);

// Start

var port = process.env.PORT || 8080;

http.createServer(function (request, response) {
  dispatcher.dispatch(request, response);
}).listen(port);

console.log('Server running at http://127.0.0.1:' + port);
