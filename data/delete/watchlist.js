var Method = require('Aeolus').Method;
var rewriteAttributeForUser = require('../../util/rewriteUser.js');

/**
 * Delete a Movie from the watchlist
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var watchlistDelete = new Method();


watchlistDelete.handle(function(req, res) {
  try {
    var movie = req.getParameter("movie");
    rewriteAttributeForUser(function(user){
      var list = user.watchlist;
      user.watchlist = list.filter(function(x) { return x !== movie; });
      return user;
    },req.getUsername(),function(user) {
      res.respondJSON(user.watchlist);
    });
  } catch (e) {
    res.respondPlainText("You need to specify what setting to add through the query.", 501);
  }
});

watchlistDelete.setHasAuth(true);

module.exports = watchlistDelete;
