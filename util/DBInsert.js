var MongoClient = require('mongodb').MongoClient;
var mongoURL = require('./DBUrl.js');
var isEmpty = require('./isEmpty.js');

var insert = function(table, object, success, error) {
  MongoClient.connect(mongoURL, function(err, db) {
    db.collection(table).findOne(object, function(error, doc) {
      if (isEmpty(doc) || doc === null || err !== null) {
        db.collection(table).insertOne(object, function(errorInserting, result) {
          db.close();
          if (errorInserting !== null) {
            error(errorInserting);
          } else {
            success(false);
          }
        });
      } else {
        success(true);
      }
    });
  });
};

module.exports = insert;
