var Method = require('aeolus').Method;
var redirecter = new Method();

redirecter.handle(function (request, response) {
  response.redirect("../#/me/watchlist");
});

module.exports = redirecter;
