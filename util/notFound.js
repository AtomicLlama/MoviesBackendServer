var notFound = function(response) {
  this.statusCode = 302;
  this.setHeader('Location', '#/404');
  this.end();
};

module.exports = notFound;
