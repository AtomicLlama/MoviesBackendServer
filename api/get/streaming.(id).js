var Method = require('aeolus').Method;
var NetflixRoulette = require('netflix-roulette');
var http = require('request');

var getURL = function(id) {
    return "https://api.themoviedb.org/3/movie/" + id + "?api_key=18ec732ece653360e23d5835670c47a0";
};

var streaming = new Method();

streaming.handle(function(request, response) {
    http(getURL(request.getParameter('id')), function(error, res, body) {
        var count = 0;
        if (!error || error === null) {
            var object = JSON.parse(body);
            var title = object.original_title;
            var date = new Date(object.release_date);
            var year = 1900 + date.getYear();
            if (title && year) {
              NetflixRoulette.title(title, function(error, data) {
                  if (!data.errorcode && error === null) {
                      var id = data.show_id;
                      response.respondJSON([{
                          "service": "netflix",
                          "id": id,
                          "link": "https://www.netflix.com/watch/" + id
                      }]);
                  } else {
                      response.respondPlainText("Couldn't find any streaming services for the movie.", 404);
                  }
              });
            } else {
              response.respondPlainText("Server Error. Couldn't identify movie.", 501);
            }
        } else {
            response.respondPlainText("Server Error. Couldn't identify movie.", 501);
        }
    });
});

module.exports = streaming;
