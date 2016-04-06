var Method = require('aeolus').Method;
var watchlistGet = new Method();

watchlistGet.DBWrapper.findAll('watchlist', function(req) {
  return { user: req.getUsername() };
}, function (item) {
  return item.movie;
});

watchlistGet.setHasAuth(true);

module.exports = watchlistGet;
