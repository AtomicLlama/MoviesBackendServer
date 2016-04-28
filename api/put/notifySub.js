var Method = require('aeolus').Method;
var DB = require('aeolus').DB;
var notifySubPost = new Method();

notifySubPost.handle(function(req, res) {
  var pref = (req.getParameter("pref") || 0) !== "0";
  DB.map("users", { facebookID: req.getUsername() }, function (user) {
    user.notifyOnSubscription = pref;
    return user;
  }, function () {
    res.respondPlainText("Preference updated to " + pref);
  }, function () {
    res.respondPlainText("Internal Server Error", 501);
  });
});

notifySubPost.setHasAuth(true);

module.exports = notifySubPost;
