var fs = require('fs');
var filename = "www/404.html";
var notFound = function(response) {
  fs.readFile(filename, "binary", function(err, file) {
    if(err) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("Not found!\n");
      response.end();
    } else {
      response.writeHead(404);
      response.write(file, "binary");
      response.end();
    }
  });
};

module.exports = notFound;
