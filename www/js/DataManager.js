app.service('DataManager', ['$http','$sce', '$q', function($http, $sce, $q) {

  var knownMovies = {};
  var knownPeople = {};
  var featured = [];
  var watchlist = [];

  var generateMovieObject = function(item) {
    if (knownMovies[item.id]) {
      return knownMovies[item.id];
    }
    var shorterTitle = "";
    if (item.original_title) {
      shorterTitle = item.original_title.substring(0,Math.min(16, item.original_title.length));
    }
    if (shorterTitle.length < item.original_title.length) {
      shorterTitle = shorterTitle.substring(0,13) + "...";
    }
    var movie = {
      title: item.original_title,
      stitle: shorterTitle,
      description: item.overview,
      short: item.overview.substring(0,Math.min(50, item.overview.length)) + "...",
      rating: item.vote_average.toFixed(1),
      poster: "https://image.tmdb.org/t/p/w300" + item.poster_path,
      detail: "https://image.tmdb.org/t/p/w1000" + item.backdrop_path,
      id: item.id,
      director: "Loading...",
      actors: [],
      year: item.release_date ? item.release_date.split("-")[0] : undefined
    };
    knownMovies[movie.id] = movie;
    return movie;
  };

  var generatePersonObject = function(currentActor) {
    var actor = knownPeople[currentActor.id] || {
      name: currentActor.name,
      id: currentActor.id,
      headshot: "https://image.tmdb.org/t/p/w185" + currentActor.profile_path,
      movies: []
    };
    knownPeople[actor.id] = actor;
    return actor;
  };

  var addMovieFromID = function(id, callback,error) {
    var url = "https://api.themoviedb.org/3/movie/" + id + "?api_key=18ec732ece653360e23d5835670c47a0";
    $http.get(url).then(function(response) {
      callback(generateMovieObject(response.data));
    }, function(err) {
      if (error) {
        error();
      }
    });
  };

  var addActorFromID = function(id, callback,error) {
    var url = "https://api.themoviedb.org/3/person/" + id + "?api_key=18ec732ece653360e23d5835670c47a0";
    $http.get(url).then(function(response) {
      callback(generatePersonObject(response.data));
    }, function(err) {
      if (error) {
        error();
      }
    });
  };

  var addMoviesForActor = function(actor) {
    var url = "https://api.themoviedb.org/3/person/" + actor.id + "/movie_credits?api_key=18ec732ece653360e23d5835670c47a0";
    $http.get(url).then(function(response) {
      var array = response.data.cast;
      var handler = function(movie) { actor.movies.push(movie); };
      for (var i = 0; i < Math.min(array.length,20); i++) {
        addMovieFromID(array[i].id, handler);
      }
    }, function(err) {
      console.log(err);
    });
  };

  var fetchLatestMovies = function() {
    featured.length = 0;
    $http.get("featured").then(function(response) {
      var array = response.data;
      for (var i=0;i<array.length;i++) {
        var movie = generateMovieObject(array[i]);
        featured.push(movie);
      }
    }, function(err) {
      console.log(err);
    });
  };

  var doBackendRequest = function(method,resource,user,callback) {
    $http.defaults.headers.common.Authorization = 'Basic ' +  window.btoa(user + ":" + user);
    $http({method: method, url: resource}).then(function(response) {
      $http.defaults.headers.common.Authorization = undefined;
      var data = response.data;
      callback(data);
    }, function(err) {
      console.log(err);
    });
  };

  var getWatchlist = function(user, callback) {
    watchlist.length = 0;
    doBackendRequest("GET","watchlist",user,function(array) {
      var handler = function(movie) { watchlist.push(movie); };
      for (var i = 0; i < array.length; i++) {
        addMovieFromID(array[i], handler);
      }
      callback(watchlist);
    });
  };

  var addToWatchlist = function(user, movie) {
    doBackendRequest("POST","watchlist?movie=" + movie.id, user, function(data) {
      watchlist.push(movie);
    });
  };

  var removeFromWatchlist = function(user, movie) {
    doBackendRequest("DELETE","watchlist?movie=" + movie.id, user, function(data) {
      watchlist = watchlist.filter(function(x) {
        return x !== movie;
      });
    });
  };

  var addActorsForMovie = function(movie) {
    if (movie.actors.length === 0) {
      var creditsUrl = "https://api.themoviedb.org/3/movie/" + movie.id + "/credits?api_key=18ec732ece653360e23d5835670c47a0";
      $http.get(creditsUrl).then(function (response) {
        var actorArray = response.data.cast;
        for (var a=0;a<Math.min(actorArray.length,5);a++) {
          var currentActor = actorArray[a];
          movie.actors.push({actor: generatePersonObject(currentActor), role: currentActor.character});
        }
      }, function(err) {
        console.log(err);
      });
    }
  };

  var getTrailerForMovie = function(movie) {
    var url = "https://api.themoviedb.org/3/movie/" + movie.id + "/videos?api_key=18ec732ece653360e23d5835670c47a0";
    $http.get(url).then(function(response) {
      var trailer = response.data.results[0].key;
      movie.video = $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + trailer + "?rel=0&amp;showinfo=0");
    }, function(err) {
      console.log(err);
    });
  };

  var request = null;

  var canceller = $q.defer();

  var search = function(text,callback) {
    if (text === undefined) {
      canceller.resolve();
      callback(featured);
    } else if (text.toLowerCase() === "my watchlist".toLowerCase() && $scope.user.loggedIn) {
      canceller.resolve();
      // get watchlist
    } else {
      var url = "https://api.themoviedb.org/3/search/multi?api_key=18ec732ece653360e23d5835670c47a0&query=" + text;
      request = $http.get(url);
      request.then(function(response) {
        var results = [];
        var array = response.data.results;
        for (var i = 0; i<array.length;i++) {
          var item = array[i];
          if (item.media_type !== "movie") {
            continue;
          }
          var movie = generateMovieObject(item);
          results.push(movie);
        }
        callback(results);
      }, function(err) {
        console.log(err);
      });
    }
  };

  return {
    load: function(user) {
      if (featured.length === 0) {
        fetchLatestMovies();
      }
      if (user) {
        getWatchlist(user);
      }
    },
    featured: function() {
      return featured;
    },
    loadActors: function(movie) {
      addActorsForMovie(movie);
    },
    search: function(term,callback) {
      search(term,callback);
    },
    getWatchlist: function(user, callback) {
      if (watchlist.length !== 0) {
        callback(watchlist);
      } else {
        getWatchlist(user,callback);
      }
    },
    isInWatchlist: function(movie) {
      return watchlist.indexOf(movie) >= 0;
    },
    toggleWatchlist: function(user,movie) {
      if (watchlist.indexOf(movie) >= 0) {
        removeFromWatchlist(user,movie);
      } else {
        addToWatchlist(user,movie);
      }
    },
    getMovie: function(id, callback,err) {
      if (knownMovies[id]) {
        var movie = knownMovies[id];
        getTrailerForMovie(movie);
        addActorsForMovie(movie);
        callback(movie);
      } else {
        addMovieFromID(id, function(movie) {
          getTrailerForMovie(movie);
          addActorsForMovie(movie);
          callback(movie);
        },err);
      }
    },
    getPerson: function(id, callback,err) {
      if (knownPeople[id]) {
        var actor = knownPeople[id];
        addMoviesForActor(actor);
        callback(actor);
      } else {
        addActorFromID(id, function(actor) {
          addMoviesForActor(actor);
          callback(actor);
        },err);
      }
    },
    getShowtimes: function(id,location,date,callback) {
      $http.get("showtimes?movie=" + id + "&lat=" + location.latitude + "&lon=" + location.longitude).then(function(response) {
        callback(response.data);
      },function(err) {
        callback([]);
      });
    }
  };

}]);
