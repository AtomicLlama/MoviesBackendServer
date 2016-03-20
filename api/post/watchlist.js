var Method = require('aeolus').Method;
var rewriteAttributeForUser = require('../../util/rewriteUser.js');

/**
 * Add a movie to a user's watchlist
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var watchlistPost = new Method();

watchlistPost.handle(function(req, res) {
  try {
    var movie = req.getParameter("movie");
    rewriteAttributeForUser(function(user){
      var list = user.watchlist;
      if (list.indexOf(movie) >= 0) {
        return user;
      } else {
        list.push(movie);
        user.watchlist = list;
        return user;
      }
    },req.getUsername(),function(user) {
      res.respondJSON(user.watchlist);
    });
  } catch (e) {
    res.respondPlainText("You need to specify what setting to add through the query.",501);
  }
});

watchlistPost.setHasAuth(true);

module.exports = watchlistPost;
