var Method = require('aeolus').Method;
var rewriteAttributeForUser = require('../../util/rewriteUser.js');

/**
 * Update the notification on subscription setting for a user
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var notifyWatchPost = new Method();

notifyWatchPost.handle(function(req, res) {
  try {
    var pref = req.getParameter("pref") !== "0";
    rewriteAttributeForUser(function(user){
      user.notifyOnWatchList = pref;
      return user;
    },req.getUsername(),function(user) {
      res.respondJSON(user.notifyOnWatchList);
    });
  } catch (e) {
    res.respondPlainText("You need to specify what setting to add through the query.",501);
  }
});

notifyWatchPost.setHasAuth(true);

module.exports = notifyWatchPost;
