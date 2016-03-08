var findUser = require('../../util/findUser.js');
var respondWith = require('../../util/respondWith.js');

/**
 * Get the Notification on Subscriptions Setting of a user
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var notifySubGet = function(req, res) {
  var callback = function(data) {
    var pref = data.notifyOnSubscription;
    respondWith(res, JSON.stringify(pref,0,4));
  };
  findUser(callback, req, res);
};

module.exports = notifySubGet;
