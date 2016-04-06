var Method = require('aeolus').Method;
var watchlistDelete = new Method();

watchlistDelete.DBWrapper.delete('watchlist', function(req) {
  return {
    user: req.getUsername(),
    movie: req.getParameter("movie")
  };
});

watchlistDelete.setHasAuth(true);

module.exports = watchlistDelete;
