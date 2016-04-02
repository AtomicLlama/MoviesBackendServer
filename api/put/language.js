var Method = require('aeolus').Method;
var rewriteAttributeForUser = require('../../util/rewriteUser.js');

/**
 * Update the language setting for a user
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var languagePost = new Method();

languagePost.handle(function(req, res) {
  try {
    var pref = req.getParameter("pref");
    rewriteAttributeForUser(function(user){
      user.preferredLanguageSetting = pref;
      return user;
    },req.getUsername(),function(user) {
      res.respondJSON(user.preferredLanguageSetting);
    });
  } catch (e) {
    res.respondPlainText("You need to specify what setting to add through the query.",501);
  }
});

languagePost.setHasAuth(true);

module.exports = languagePost;
