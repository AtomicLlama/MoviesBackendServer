var Aeolus = require('aeolus');
var auth = require('./util/authentification.js');

Aeolus.auth(auth);
Aeolus.methods("/data");
Aeolus.onError(function(req,res) {
  res.redirect("../#/404");
});

var port = process.env.PORT || 8080;

Aeolus.createServer(port);
