var Method = require('aeolus').Method;
var findUser = require('../../util/findUser.js');

var distanceGet = new Method();

/**
 * Get the Distance Setting of a user
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
distanceGet.handle(function(req, res) {
  var callback = function(data) {
    var distance = data.maxDistanceForCinema;
    res.respondJSON(distance);
  };
  findUser(callback, req.getUsername());
});

distanceGet.setHasAuth(true);

module.exports = distanceGet;
