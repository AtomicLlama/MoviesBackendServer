var Method = require('aeolus').Method;
var rewriteAttributeForUser = require('../../util/rewriteUser.js');

/**
 * Update the distance setting for a user
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var distancePost = new Method();

distancePost.handle(function(req, res) {
  try {
    var pref = req.getParameter("pref");
    rewriteAttributeForUser(function(user){
      user.maxDistanceForCinema = pref;
      return user;
    },req.getUsername(),function(user) {
      res.respondJSON(user.maxDistanceForCinema);
    });
  } catch (e) {
    res.respondPlainText("You need to specify what setting to add through the query.",501);
  }
});

distancePost.setHasAuth(true);

module.exports = distancePost;
