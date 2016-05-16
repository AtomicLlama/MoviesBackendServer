var Method = require('aeolus').Method;
var NetflixRoulette = require('netflix-roulette');
var http = require('request');

var supported = {
  'netflix_instant': function(id) {
    return {
      "service": "netflix",
      "id": id,
      "link": "https://www.netflix.com/watch/" + id
    };
  }
};

var map = function(name, object) {
  console.log(name);
  if (supported[name]) {
    return supported[name](object.external_id);
  } else {
    return {
      "service": object.friendlyName,
      "id": object.external_id,
      "link": object.direct_url
    };
  }
};

var getURL = function(id) {
    return "https://api.themoviedb.org/3/movie/" + id + "?api_key=18ec732ece653360e23d5835670c47a0";
};

var canistreamitsearch = function(name) {
  return 'http://www.canistream.it/services/search?movieName=' + name;
};

var canistreamitstream = function(id) {
  return 'http://www.canistream.it/services/query?movieId=' + id + '&attributes=1&mediaType=streaming';
};

var getStreamID = function(movie, year, callback, error) {
  http(canistreamitsearch(movie), function(err, res, body) {
    var data = JSON.parse(body);
    var matches = data.filter(function(x) { return x.year === year; });
    console.log(matches);
    if (matches.length > 0) {
      callback(matches[0]._id);
    } else {
      error();
    }
  });
};

var getStreams = function(movie, year, callback, error) {
  console.log(movie);
  console.log(year);
  getStreamID(movie, year, function(id) {
    http(canistreamitstream(id), function(err, res, body) {
      var data = JSON.parse(body);
      if (data.length === 0) {
        error();
        return;
      }
      var result = [];
      Object.keys(data).forEach(function(key, index) {
        result.push(map(key, data[key]));
      });
      console.log(result);
      callback(result);
    });
  }, error);
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
              getStreams(title, year, function(data) {
                response.respondJSON(data);
              }, function() {
                response.respondPlainText("No Streaming options available", 404);
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
