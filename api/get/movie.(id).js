var Method = require('aeolus').Method;
var redirecter = new Method();

redirecter.handle(function (request, response) {
  response.redirect("../#/movie/" + request.getParameter("id"));
});

module.exports = redirecter;
