var Method = require('aeolus').Method;
var DB = require('aeolus').DB;
var distancePost = new Method();

distancePost.handle(function(req, res) {
  var pref = req.getParameter("pref");
  DB.map("users", { facebookID: req.getUsername() }, function (user) {
    user.maxDistanceForCinema = pref;
    return user;
  }, function () {
    res.respondPlainText("Preference updated to " + pref);
  }, function () {
    res.respondPlainText("Internal Server Error", 501);
  });
});

distancePost.setHasAuth(true);

module.exports = distancePost;
