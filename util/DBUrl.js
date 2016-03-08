var fs = require('fs');

/**
 * Return url of the DB
 * @return {[type]} [description]
 */
var getUrl = function() {
  var data = fs.readFileSync('database.json');
  data = JSON.parse(data);
  return "mongodb://" + data.username + ":" + data.password + "@" + data.url;
};

module.exports = getUrl();
