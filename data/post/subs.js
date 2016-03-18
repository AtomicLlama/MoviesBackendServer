var Method = require('Aeolus').Method;
var rewriteAttributeForUser = require('../../util/rewriteUser.js');

/**
 * Add a person to a user's subscriptions
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var subsPost = new Method();

subsPost.handle(function(req, res) {
  try {
    var person = req.getParameter("person");
    rewriteAttributeForUser(function(user) {
      var list = user.subs || [];
      if (list.indexOf(person) >= 0) {
        return user;
      } else {
        list.push(person);
        user.subs = list;
        return user;
      }
    },req.getUsername(),function(user) {
      res.respondJSON(user.subs);
    });
  } catch (e) {
    res.respondPlainText("You need to specify what setting to add through the query.",501);
  }
});

subsPost.setHasAuth(true);

module.exports = subsPost;
