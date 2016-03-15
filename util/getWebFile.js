var fs = require('fs');
var path = require('path');
var url = require('url');

var getWebFile = function(request,response,callback) {
  var uri = "www" + url.parse(request.url).pathname;
  var filename = path.join(process.cwd(), uri);
  fs.exists(filename, function(exists) {
    if(!exists) {
      callback(request,response);
    } else {
      if (fs.statSync(filename).isDirectory()) filename += '/index.html';
      fs.readFile(filename, "binary", function(err, file) {
        if(err) {
          response.writeHead(500, {"Content-Type": "text/plain"});
          response.write(err + "\n");
          response.end();
        } else {
          response.writeHead(200);
          response.write(file, "binary");
          response.end();
        }
      });
    }
  });
};
module.exports = getWebFile;
