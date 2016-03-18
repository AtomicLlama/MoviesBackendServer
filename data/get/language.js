var Method = require('Aeolus').Method;
var findUser = require('../../util/findUser.js');


var languageGet = new Method();

/**
 * Get the Language Setting of a user
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
languageGet.handle(function(req, res) {
  var callback = function(data) {
    var setting = data.preferredLanguageSetting;
    res.respondJSON(setting);
  };
  findUser(callback, req.getUsername());
});

languageGet.setHasAuth(true);

module.exports = languageGet;
