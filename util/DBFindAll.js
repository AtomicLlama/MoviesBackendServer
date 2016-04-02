var MongoClient = require('mongodb').MongoClient;
var mongoURL = require('./DBUrl.js');
var isEmpty = require('./isEmpty.js');

var findAll = function(table, object, success, error) {
  MongoClient.connect(mongoURL, function(err, db) {
    db.collection(table).find(object).toArray(function(error, doc) {
      if (isEmpty(doc) || doc === null || err !== null) {
        db.close();
        error(err);
      } else {
        db.close();
        success(doc);
      }
    });
  });
};

module.exports = findAll;
