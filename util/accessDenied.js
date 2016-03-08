/**
 * Give the user an access denied response
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var accessDenied = function(res) {
  res.writeHead(401,{'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'WWW-Authenticate': 'Basic realm="example"'
  });
  res.end("Wrong Password!");
};

module.exports = accessDenied;
