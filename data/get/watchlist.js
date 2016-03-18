var Method = require('Aeolus').Method;
var findUser = require('../../util/findUser.js');


/**
 * Get the watchlist of a user
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var watchlistGet = new Method();

watchlistGet.handle(function(req, res) {
  var callback = function(data) {
    var movies = data.watchlist;
    res.respondJSON(movies);
  };
  findUser(callback, req.getUsername());
});

module.exports = watchlistGet;
