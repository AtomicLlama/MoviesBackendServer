var Method = require('aeolus').Method;
var MongoClient = require('mongodb').MongoClient;
var remove = require('../../util/DBDelete.js');

/**
 * Delete a Movie from the watchlist
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var watchlistDelete = new Method();

watchlistDelete.handle(function(req, res) {
  var movie = req.getParameter("movie");
  var id = req.getUsername();
  remove("watchlist", {user: id, movie: movie}, function() {
    res.respondPlainText("Movie removed from your watchlist");
  }, function(err) {
    res.respondJSON(err, 501);
  });
});

watchlistDelete.setHasAuth(true);

module.exports = watchlistDelete;
