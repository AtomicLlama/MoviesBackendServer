
/**
 * Respond to a request with an item
 * @param  {Response} res  response object
 * @param  {Object}   item item you want to respond to
 * @return {void}          nothing
 */
var respondWith = function(res, item) {
  res.writeHead(200, {'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  });
  res.end(item);
};

module.exports = respondWith;
