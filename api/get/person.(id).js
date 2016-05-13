var Method = require('aeolus').Method;
var redirecter = new Method();

redirecter.handle(function (request, response) {
  response.redirect("../#/person/" + request.getParameter("id"));
});

module.exports = redirecter;
