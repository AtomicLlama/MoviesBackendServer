var Method = require('aeolus').Method;
var insert = require('../../util/DBInsert.js');

/**
 * Add a movie to a user's watchlist
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var watchlistPost = new Method();

watchlistPost.handle(function(req, res) {
  var movie = req.getParameter("movie");
  var id = req.getUsername();
  insert("watchlist", {user: id, movie: movie}, function(present) {
    if (present) {
      res.respondPlainText("Movie was already in your watchlist, but ok...");
    } else {
      res.respondPlainText("Movie Succesfully added to your watchlist.");
    }
  }, function(err) {
    res.respondJSON(err, 501);
  });
});

watchlistPost.setHasAuth(true);

module.exports = watchlistPost;
