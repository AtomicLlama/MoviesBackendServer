var fs = require('fs');

var getUrl = function() {
  var data = fs.readFileSync('database.json');
  console.log(data);
  data = JSON.parse(data);
  return "mongodb://" + data.username + ":" + data.password + "@" + data.url;
};

module.exports = getUrl();
