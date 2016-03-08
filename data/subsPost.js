var url = require('url');
var rewriteAttributeForUser = require('../util/rewriteUser.js');

/**
 * Add a person to a user's subscriptions
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var subsPost = function(req, res) {
  var queryObject = url.parse(req.url, true);
  var query = queryObject.query;
  try {
    var person = query.person;
    rewriteAttributeForUser(req, function(user){
      var list = user.subs;
      var newList = [];
      for (var i = 0;i<list.length;i++) {
        if (list[i] != person) {
          newList.push(list[i]);
        }
      }
      newList.push(person);
      user.subs = newList;
      return user;
    },res);
  } catch (e) {
    res.writeHead(501, {'Content-Type': 'application/json'});
    res.end("You need to specify what setting to add through the query.");
  }
};

module.exports = subsPost;
