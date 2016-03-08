var findUser = require('../../util/findUser.js');
var respondWith = require('../../util/respondWith.js');

/**
 * Get the watchlist of a user
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var watchlistGet = function(req, res) {
  var callback = function(data) {
    var movies = data.watchlist;
    respondWith(res, JSON.stringify(movies,0,4));
  };
  findUser(callback, req, res);
};

module.exports = watchlistGet;
