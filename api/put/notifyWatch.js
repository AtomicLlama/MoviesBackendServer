var Method = require('aeolus').Method;
var DB = require('aeolus').DB;
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
