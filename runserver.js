var aeolus = require('aeolus');
var auth = require('./util/authentification.js');

aeolus.auth(auth);
aeolus.methods("/api");
aeolus.onError(function(req,res) {
  res.redirect("../#/404");
});

var port = process.env.PORT || 8080;

aeolus.createServer(port);
