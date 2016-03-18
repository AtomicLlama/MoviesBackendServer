var Method = require('Aeolus').Method;
var findUser = require('../../util/findUser.js');

var subsGet = new Method();

/**
 * Get the Subscriptions of a user
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
subsGet.handle(function(req, res) {
  var callback = function(data) {
    var subs = data.subs || [];
    res.respondJSON(subs);
  };
  findUser(callback, req.getUsername());
});

subsGet.setHasAuth(true);

module.exports = subsGet;
