var url = require('url');
var rewriteAttributeForUser = require('../util/rewriteUser.js');

var watchlistPost = function(req, res) {
  var queryObject = url.parse(req.url, true);
  var query = queryObject.query;
  try {
    var pref = query.pref !== "0";
    rewriteAttributeForUser(req, function(user){
      user.notifyOnWatchList = pref;
      return user;
    },res);
  } catch (e) {
    res.writeHead(501, {'Content-Type': 'application/json'});
    res.end("You need to specify what setting to add through the query.");
  }
};

module.exports = watchlistPost;
