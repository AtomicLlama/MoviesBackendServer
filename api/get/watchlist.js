var Method = require('aeolus').Method;
var findAll = require('../../util/DBFindAll.js');


/**
 * Get the watchlist of a user
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var watchlistGet = new Method();

watchlistGet.handle(function(req, res) {
  var id = req.getUsername();
  findAll("watchlist", {user: id}, function(movies) {
    var items = movies.map(function(item) { return item.movie; });
    res.respondJSON(items);
  }, function(err) {
    res.respondJSON([]);
  });
});

watchlistGet.setHasAuth(true);

module.exports = watchlistGet;
