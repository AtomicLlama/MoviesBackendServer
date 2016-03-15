//HTTP Listener

//HTTP Dispatcher that allows us to handle any request

var http = require('http');
var dispatcher = require('httpdispatcher');
var fs = require('fs');
var getWebFile = require('./util/getWebFile.js');
var notFound = require('./util/notFound.js');

// Allowing Delete and Put

dispatcher.listeners.delete = [];
dispatcher.listeners.put = [];

// Add 404 Case

dispatcher.onError = function(req, res) {
  notFound(res);
};

// Read all the supported methods from disk

var data = fs.readFileSync('methods.json');
data = JSON.parse(data);

// Fetch function and add it to the dispatcher

for (var i = 0; i < data.length; i++) {
  var name = data[i].name;
  var methods = data[i].methods;
  for (var j = 0; j < methods.length; j++) {
    var method = methods[j];
    var func = require('./data/' + method + '/' + name + '.js');
    dispatcher.on(method,'/' + name, func);
  }
}

// Start

var port = process.env.PORT || 8080;

http.createServer(function (request, response) {
  var callback = function(req,res) {
    dispatcher.dispatch(req,res);
  };
  getWebFile(request,response,callback);
}).listen(port);

console.log('Server running at http://127.0.0.1:' + port);
