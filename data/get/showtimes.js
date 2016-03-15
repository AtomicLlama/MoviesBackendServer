var Showtimes = require('showtimes');
var url = require('url');
var request = require('request');
var respondWith = require('../../util/respondWith.js');

var getURL = function(movie, language) {
  return "https://api.themoviedb.org/3/movie/" + movie + "?api_key=18ec732ece653360e23d5835670c47a0&language=" + language;
};

var getAllNames = function(id, callback) {
  var names = [];
  request("https://api.themoviedb.org/3/movie/" + id + "/translations?api_key=18ec732ece653360e23d5835670c47a0", function(error, response, body) {
    var count = 0;
    if (error === null) {
      translations = JSON.parse(body).translations.map(function(x) {
        return x.iso_639_1;
      });
      if (translations.length === 0) {
        callback([]);
      }
      var handler = function(e,r,b) {
        if (e === null) {
          var data = JSON.parse(b);
          names.push(data.title);
        }
        count++;
        if (count === translations.length) {
          callback(names);
        }
      };
      for (var i = 0; i < translations.length; i++) {
        request(getURL(id,translations[i]),handler);
      }
    }
  });
};

var getTimes = function(timesAPI, allowed, res) {
  timesAPI.getTheaters(function(err, response) {
    if (err === null) {
      var theatresShowingMovie = response.filter(function(theatre) {
        for (var j in theatre.movies) {
          var item = theatre.movies[j];
          var nameForMovie = item.name;
          if (allowed.indexOf(nameForMovie.replace(/ *\([^)]*\) */g, "")) > -1) {
            return true;
          }
        }
      });
      var returnableResponse = theatresShowingMovie.reduce(function (array,theatre) {
        var movies = theatre.movies.filter(function(item) {
          var nameForMovie = item.name;
          return allowed.indexOf(nameForMovie.replace(/ *\([^)]*\) */g, "")) > -1;
        });
        var stuff = movies.map(function(item) {
          return {
            name: theatre.name,
            address: theatre.address,
            showtimes: item.showtimes,
            film: item.name
          };
        });
        return array.concat(stuff);
      },[]);
      if (returnableResponse.length > 0) {
        respondWith(res, JSON.stringify(returnableResponse,0,4));
      } else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end("No theatres");
      }
    } else {
      res.writeHead(404, {'Content-Type': 'application/json'});
      res.end(err);
    }
  });
};

/**
 * Get showtimes for a specific movie in specific coordinates
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
*/
var showtimeGet = function(req,res) {
  var queryObject = url.parse(req.url, true);
  var query = queryObject.query;
  var lat = query.lat;
  var lon = query.lon;
  var movie = query.movie;
  var timesAPI = new Showtimes(lat + "," + lon, {});
  if (query.date) {
    timesAPI = new Showtimes(lat + "," + lon, {date: query.date});
  }
  try {
    getAllNames(movie, function(names) {
      getTimes(timesAPI,names,res);
    });
  } catch(err) {
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end(err);
  }
};

module.exports = showtimeGet;
