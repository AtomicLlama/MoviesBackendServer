var findUser = require('../util/findUser.js');
var respondWith = require('../util/respondWith.js');

/**
 * Get the Distance Setting of a user
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var distanceGet = function(req, res) {
  var callback = function(data) {
    var distance = data.maxDistanceForCinema;
    respondWith(res, JSON.stringify(distance,0,4));
  };
  findUser(callback, req, res);
};

module.exports = distanceGet;
