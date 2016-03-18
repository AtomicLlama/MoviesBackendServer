var Method = require('Aeolus').Method;
var request = require('request');

var movies = [];
var lastCheck = null;

var resources = ["now_playing","upcoming","popular"];

var msPerDay = 8.64e7;

var url = function(resource) {
  return "https://api.themoviedb.org/3/movie/" + resource + "?api_key=18ec732ece653360e23d5835670c47a0";
};

var toSet = function(data,map) {
  var targetAttributes = [];
  var newData = [];
  for (var i = 0; i < data.length; i++) {
    if (targetAttributes.indexOf(map(data[i])) < 0) {
      newData.push(data[i]);
      targetAttributes.push(map(data[i]));
    }
  }
  return newData;
};

var getDiffInDays = function(date) {
  if (date === null) return 1;
  var today = Date.now();
  var diff = (today - date) / msPerDay;
  return Math.abs(diff);
};

var filter = function(movie) {
  var popularity = movie.popularity >= 3;
  var date = Date.parse(movie.release_date);
  var diff = getDiffInDays(date) / 30;
  return popularity && diff < 2.5 && movie.vote_average > 2.0;
};

var compare = function(a,b) {
  var diff = b.popularity - a.popularity;
  if (Math.abs(diff) < 1) {
    return b.vote_average - a.vote_average;
  }
  return diff;
};

var getMovies = new Method();

getMovies.handle(function(req, res) {
  var count = 0;
  if (movies.length === 0 || getDiffInDays(lastCheck) > 0.5) {
    lastCheck = Date.now();
    var handler = function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body).results;
        var filtered = data.filter(filter);
        movies = movies.concat(filtered);
      }
      count++;
      if (count === resources.length) {
        movies = toSet(movies,function(x) { return x.id; });
        movies = movies.sort(compare);
        res.respondJSON(movies);
      }
    };
    for (var i = 0; i < resources.length; i++) {
      request(url(resources[i]), handler);
    }
  } else {
    res.respondJSON(movies);
  }
});

module.exports = getMovies;
