var Method = require('aeolus').Method;
var DB = require('aeolus').DB;
var Showtimes = require('showtimes');
var request = require('request');

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
  console.log(timesAPI);
  timesAPI.getTheaters(function(err, response) {
    console.log(err);
    console.log(response);
    if (err === null) {
      var theatresShowingMovie = response.filter(function(theatre) {
        for (var j in theatre.movies) {
          var item = theatre.movies[j];
          var nameForMovie = item.name;
          if (allowed.indexOf(nameForMovie.replace(/ *\([^)]*\) */g, "")) >= 0) {
            return true;
          }
        }
        return false;
      });
      var returnableResponse = theatresShowingMovie.reduce(function (array,theatre) {
        var movies = theatre.movies.filter(function(item) {
          var nameForMovie = item.name;
          return allowed.indexOf(nameForMovie.replace(/ *\([^)]*\) */g, "")) >= 0;
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
        res.respondJSON(returnableResponse);
      } else {
        res.respondPlainText("No theatres found",404);
      }
    } else {
      res.respondPlainText("No theatres found",404);
    }
  });
};

var roundCoordinate = function(coordinate) {
  coordinate *= 10;
  coordinate = Math.round(coordinate);
  coordinate /= 10;
  return coordinate + "";
};

var showtimeGet = new Method();

/**
 * Get showtimes for a specific movie in specific coordinates
 * @param  {Request}  req  Request
 * @param  {Response} res  Response
 * @return {void}          nothing
*/
showtimeGet.handle(function(req,res) {
  var lat = req.getParameter("lat");
  var lon = req.getParameter("lon");
  var movie = req.getParameter("movie");
  DB.map('users', { facebookID: req.getUsername() }, function(user) {
    var key = roundCoordinate(lat).replace(".","_") + "," + roundCoordinate(lon).replace(".","_");
    if (user.locations) {
      user.locations[key] = user.locations[key] ? user.locations[key] + 1 : 1;
    } else {
      user.locations = {};
      user.locations[key] = 1;
    }
    return user;
  }, function() {
    console.log("Success updating location of the user in DB.");
  }, function(err) {
    console.error("Error " + err );
  });
  try {
    var location = lat + "," + lon;
    console.log(location);
    var timesAPI = new Showtimes(location, {});
    if (req.getParameter("date")) {
      timesAPI = new Showtimes(location, {date: req.getParameter("date")});
    }
  } catch (e) {
    res.respondPlainText("You need to specify what setting to add through the query.", 501);
  }
  getAllNames(movie, function(names) {
    console.log("Names: " + names);
    getTimes(timesAPI,names,res);
  });
});

showtimeGet.setHasAuth(true);


module.exports = showtimeGet;
