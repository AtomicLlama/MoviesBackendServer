var Method = require('aeolus').Method;
var subsDelete = new Method();

subsDelete.DBWrapper.delete('subs', function(req) {
  return {
    user: req.getUsername(),
    person: req.getParameter("person")
  };
});

subsDelete.setHasAuth(true);

module.exports = subsDelete;
