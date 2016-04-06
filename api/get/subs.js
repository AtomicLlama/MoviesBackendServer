var Method = require('aeolus').Method;
var subsGet = new Method();

subsGet.DBWrapper.findAll('subs', function (req) {
  return {
    user: req.getUsername()
  };
}, function (item) {
  return user.person;
});

subsGet.setHasAuth(true);

module.exports = subsGet;
