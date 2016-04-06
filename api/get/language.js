var Method = require('aeolus').Method;
var languageGet = new Method();

languageGet.onError(require('../../util/registerUser.js'));

languageGet.DBWrapper.find('users', function (req) {
  return {
    facebookID: req.getUsername()
  };
},function (user) {
  return user.preferredLanguageSetting;
});

languageGet.setHasAuth(true);

module.exports = languageGet;
