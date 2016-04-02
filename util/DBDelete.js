var MongoClient = require('mongodb').MongoClient;
var mongoURL = require('./DBUrl.js');
var isEmpty = require('./isEmpty.js');

var remove = function(table, object, success, error) {
  MongoClient.connect(mongoURL, function(err, db) {
    db.collection(table).deleteMany(object, function(err, results) {
      if (err !== null) {
        error(err);
      } else {
        success();
      }
    });
  });
};

module.exports = remove;
