var Method = require('aeolus').Method;
var rewriteAttributeForUser = require('../../util/rewriteUser.js');

var subsDelete = new Method();

/**
 * Remove a person from a user's subscriptions
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
subsDelete.handle(function(req, res) {
  try {
    var person = req.getParameter("person");
    rewriteAttributeForUser(function(user){
      var list = user.subs || [];
      user.subs = list.filter(function(x) { return x !== person; });
      return user;
    }, req.getUsername(), function(user) {
      res.respondJSON(user.subs);
    });
  } catch (e) {
    res.respondPlainText("You need to specify what setting to add through the query.",501);
  }
});

subsDelete.setHasAuth(true);

module.exports = subsDelete;
