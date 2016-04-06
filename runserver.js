var Aeolus = require('aeolus');
var auth = require('./util/auth.js');
var dbUrl = require('./util/DBUrl.js');

Aeolus.setDB(dbUrl);
Aeolus.auth(auth);
Aeolus.methods("/api");
Aeolus.onError(function(req,res) {
  res.redirect("../#/404");
});

var port = process.env.PORT || 8080;

Aeolus.createServer(port);
