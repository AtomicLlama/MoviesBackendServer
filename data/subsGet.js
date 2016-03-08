var findUser = require('../util/findUser.js');
var respondWith = require('../util/respondWith.js');

/**
 * Get the Subscriptions of a user
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var subsGet = function(req, res) {
  var callback = function(data) {
    var subs = data.subs || [];
    respondWith(res, JSON.stringify(subs,0,4));
  };
  findUser(callback, req, res);
};

module.exports = subsGet;
