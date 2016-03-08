var Showtimes = require('showtimes');
var url = require('url');
var respondWith = require('../util/respondWith.js');

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
    request("https://api.themoviedb.org/3/movie/" + movie + "/alternative_titles?api_key=18ec732ece653360e23d5835670c47a0",function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var alternatives = JSON.parse(body).titles;
        var names = alternatives.map(function (item) {
          return item.title;
        });
        request("https://api.themoviedb.org/3/movie/" + movie + "?api_key=18ec732ece653360e23d5835670c47a0",function (error, response, body) {
          names.push(JSON.parse(body).original_title);
          var allowed = names.reduce(function(array, title) {
            return array.concat(title.split(": ").reduce(function(arr,item) {
              return arr.concat(item.split(" - "));
            },[]));
          },[]);
          timesAPI.getTheaters(function(err, response) {
            if (err === null) {
              var theatresShowingMovie = response.filter(function(theatre) {
                for (var j in theatre.movies) {
                  var item = theatre.movies[j];
                  var namesForMovie = item.name.split(": ").reduce(function(arr,item) {
                    return arr.concat(item.split(" - "));
                  },[]);
                  for (var i in namesForMovie) {
                    if (allowed.indexOf(namesForMovie[i]) > -1) {
                      return true;
                    }
                  }
                }
              });
              var returnableResponse = theatresShowingMovie.reduce(function (array,theatre) {
                var theatreShowings = [];
                var movies = theatre.movies.filter(function(item) {
                  var namesForMovie = item.name.split(": ").reduce(function(arr,item) {
                    return arr.concat(item.split(" - "));
                  },[]);
                  for (var i in namesForMovie) {
                    if (allowed.indexOf(namesForMovie[i]) > -1) {
                      return true;
                    }
                  }
                  return false;
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
              if (err === null && returnableResponse.length > 0) {
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
        });
      }
    });
  } catch(err) {
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end(err);
  }
};

module.exports = showtimeGet;
