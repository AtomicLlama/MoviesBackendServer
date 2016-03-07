var url = require('url');
var rewriteAttributeForUser = require('../util/rewriteUser.js');

var notifyWatchPost = function(req, res) {
  var queryObject = url.parse(req.url, true);
  var query = queryObject.query;
  try {
    var movie = query.movie;
    rewriteAttributeForUser(req, function(user){
      var watchlist = user.watchlist;
      var newWatchlist = [];
      for (var i = 0;i<watchlist.length;i++) {
        if (watchlist[i] != movie) {
          newWatchlist.push(watchlist[i]);
        }
      }
      newWatchlist.push(movie);
      user.watchlist = newWatchlist;
      return user;
    },res);
  } catch (e) {
    res.writeHead(501, {'Content-Type': 'application/json'});
    res.end("You need to specify what setting to add through the query.");
  }
};

module.exports = notifyWatchPost;
