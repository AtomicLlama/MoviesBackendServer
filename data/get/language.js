var findUser = require('../../util/findUser.js');
var respondWith = require('../../util/respondWith.js');

/**
 * Get the Language Setting of a user
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
 */
var languageGet = function(req, res) {
  var callback = function(data) {
    var setting = data.preferredLanguageSetting;
    respondWith(res, JSON.stringify(setting,0,4));
  };
  findUser(callback, req, res);
};

module.exports = languageGet;
