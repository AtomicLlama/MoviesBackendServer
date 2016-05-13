var Method = require('aeolus').Method;
var redirecter = new Method();

redirecter.handle(function (request, response) {
  response.redirect("../#/tickets/" + request.getParameter("id"));
});

module.exports = redirecter;
