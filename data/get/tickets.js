var findUser = require('../../util/findUser.js');
var respondWith = require('../../util/respondWith.js');

/**
 * Get all the tickets for a user
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var ticketsGet = function(req, res) {
  var callback = function(data) {
    var tickets = data.tickets;
    respondWith(res, JSON.stringify(tickets,0,4));
  };
  findUser(callback, req, res);
};

module.exports = ticketsGet;
