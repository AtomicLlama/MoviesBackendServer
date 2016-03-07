var isUserRegistered = require('../util/isUserRegistered.js');
var respondWith = require('../util/respondWith.js');

var ticketsGet = function(req, res) {
  var callback = function(data) {
    var tickets = data.tickets;
    respondWith(res, JSON.stringify(tickets,0,4));
  };
  isUserRegistered(callback, req, res);
};

module.exports = ticketsGet;
