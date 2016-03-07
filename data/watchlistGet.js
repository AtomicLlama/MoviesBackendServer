var isUserRegistered = require('../util/isUserRegistered.js');
var respondWith = require('../util/respondWith.js');

var watchlistGet = function(req, res) {
  console.log("Watchlist!");
  var callback = function(data) {
    var movies = data.watchlist;
    respondWith(res, JSON.stringify(movies,0,4));
  };
  isUserRegistered(callback, req, res);
};

module.exports = watchlistGet;
