var Method = require('aeolus').Method;
var DB = require('aeolus').DB;
var languagePost = new Method();

languagePost.handle(function(req, res) {
  var pref = req.getParameter("pref");
  DB.map("users", { facebookID: req.getUsername() }, function (user) {
    user.preferredLanguageSetting = pref;
    return user;
  }, function () {
    res.respondPlainText("Preference updated to " + pref);
  }, function () {
    res.respondPlainText("Internal Server Error", 501);
  });
});

languagePost.setHasAuth(true);

module.exports = languagePost;
