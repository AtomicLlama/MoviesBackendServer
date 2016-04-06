var Method = require('aeolus').Method;
var watchlistPost = new Method();

watchlistPost.DBWrapper.insert("watchlist", function (req) {
  return {
    user: req.getUsername(),
    movie: req.getParameter("movie")
  };
});

watchlistPost.setHasAuth(true);

module.exports = watchlistPost;
