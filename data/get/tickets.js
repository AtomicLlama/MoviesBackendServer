var Method = require('Aeolus').Method;
var findUser = require('../../util/findUser.js');


/**
 * Get all the tickets for a user
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var ticketsGet = new Method();

ticketsGet.handle(function(req, res) {
  var callback = function(data) {
    var tickets = data.tickets;
    res.respondJSON(tickets);
  };
  findUser(callback, req.getUsername());
});

ticketsGet.setHasAuth(true);

module.exports = ticketsGet;
