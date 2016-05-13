var Method = require('aeolus').Method;
var redirecter = new Method();

redirecter.handle(function (request, response) {
  response.redirect("../#/search/" + request.getParameter("query"));
});

module.exports = redirecter;
