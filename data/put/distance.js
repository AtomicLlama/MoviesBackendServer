var url = require('url');
var rewriteAttributeForUser = require('../../util/rewriteUser.js');

/**
 * Update the distance setting for a user
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var distancePost = function(req, res) {
  var queryObject = url.parse(req.url, true);
  var query = queryObject.query;
  try {
    var pref = query.pref;
    rewriteAttributeForUser(req, function(user){
      user.maxDistanceForCinema = pref;
      return user;
    },res);
  } catch (e) {
    res.writeHead(501, {'Content-Type': 'application/json'});
    res.end("You need to specify what setting to add through the query.");
  }
};

module.exports = distancePost;
