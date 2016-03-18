var Method = require('Aeolus').Method;
var findUser = require('../../util/findUser.js');


var notifyWatchGet = new Method();

/**
 * Get the Language Setting of a user
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
notifyWatchGet.handle(function(req, res) {
  var callback = function(data) {
    var pref = data.notifyOnWatchList;
    res.respondJSON(pref);
  };
  findUser(callback, req.getUsername());
});

notifyWatchGet.setHasAuth(true);

module.exports = notifyWatchGet;
