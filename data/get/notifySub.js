var Method = require('aeolus').Method;
var findUser = require('../../util/findUser.js');


var notifySubGet = new Method();

/**
 * Get the Language Setting of a user
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
notifySubGet.handle(function(req, res) {
  var callback = function(data) {
    var pref = data.notifyOnSubscription;
    res.respondJSON(pref);
  };
  findUser(callback, req.getUsername());
});

notifySubGet.setHasAuth(true);

module.exports = notifySubGet;
