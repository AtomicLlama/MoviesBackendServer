var Method = require('aeolus').Method;
var subsPost = new Method();

subsPost.DBWrapper.insert("subs", function (req) {
  return {
    user: req.getUsername(),
    person: req.getParameter("person")
  };
});

subsPost.setHasAuth(true);

module.exports = subsPost;
