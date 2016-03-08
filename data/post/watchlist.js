var url = require('url');
var rewriteAttributeForUser = require('../../util/rewriteUser.js');

/**
 * Add a movie to a user's watchlist
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var watchlistPost = function(req, res) {
  var queryObject = url.parse(req.url, true);
  var query = queryObject.query;
  try {
    var movie = query.movie;
    rewriteAttributeForUser(req, function(user){
      var list = user.watchlist;
      if (list.indexOf(movie) < 0) {
        return user;
      } else {
        list.push(movie);
        user.watchlist = list;
        return user;
      }
    },res);
  } catch (e) {
    res.writeHead(501, {'Content-Type': 'application/json'});
    res.end("You need to specify what setting to add through the query.");
  }
};

module.exports = watchlistPost;
