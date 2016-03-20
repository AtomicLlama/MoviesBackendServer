var Method = require('aeolus').Method;
var rewriteAttributeForUser = require('../../util/rewriteUser.js');

/**
 * Update the notification on subscription setting for a user
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var notifySubPost = new Method();

notifySubPost.handle(function(req, res) {
  try {
    var pref = req.getParameter("pref") !== "0";
    rewriteAttributeForUser(function(user){
      user.notifyOnSubscription = pref;
      return user;
    },req.getUsername(),function(user) {
      res.respondJSON(user.notifyOnSubscription);
    });
  } catch (e) {
    res.respondPlainText("You need to specify what setting to add through the query.",501);
  }
});

notifySubPost.setHasAuth(true);

module.exports = notifySubPost;
