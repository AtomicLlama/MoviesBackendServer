var url = require('url');
var rewriteAttributeForUser = require('../../util/rewriteUser.js');

/**
 * Remove a person from a user's subscriptions
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var subsDelete = function(req, res) {
  var queryObject = url.parse(req.url, true);
  var query = queryObject.query;
  try {
    var person = query.person;
    rewriteAttributeForUser(req, function(user){
      var list = user.subs || [];
      user.subs = list.filter(function(x) { return x !== person; });
      return user;
    }, res);
  } catch (e) {
    res.writeHead(501, {'Content-Type': 'application/json'});
    res.end("You need to specify what setting to add through the query.");
  }
};

module.exports = subsDelete;
