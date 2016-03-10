var app = angular.module('movies', []);

app.controller('MainCtrl', function ($scope, $http, $q, $sce) {



  $scope.user = {
    name: "",
    id: "",
    loggedIn: false,
    image: ""
  };

  $('.button-collapse').sideNav({
      menuWidth: 500, // Default is 240
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    }
  );

  $scope.inTheatres = [];

  var addActorsForMovie = function(movie) {
    var creditsUrl = "https://api.themoviedb.org/3/movie/" + movie.id + "/credits?api_key=18ec732ece653360e23d5835670c47a0";
    $http.get(creditsUrl).then(function (response) {
      var actorArray = response.data.cast;
      for (var a=0;a<Math.min(actorArray.length,5);a++) {
        var currentActor = actorArray[a];
        var actor = {
          name: currentActor.name,
          id: currentActor.id,
          headshot: "https://image.tmdb.org/t/p/w185" + currentActor.profile_path
        };
        console.log(actor);
        movie.actors.push({actor: actor, role: currentActor.character});
      }
    }, function(err) {
      console.log(err);
    });
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

  var fetchLatestMovies = function() {
    $scope.inTheatres.lenght = 0;
    var url = "https://api.themoviedb.org/3/movie/now_playing?api_key=18ec732ece653360e23d5835670c47a0";
    $http.get(url).then(function(response) {
      var array = response.data.results;
      for (var i=0;i<array.length;i++) {
        var item = array[i];
        var shorterTitle;
        if (item.overview) {
          shorterTitle = item.original_title.substring(0,Math.min(16, item.original_title.length));
        }
        if (shorterTitle.length < item.original_title.length) {
          shorterTitle = shorterTitle.substring(0,13) + "...";
        }
        var newObjectForMovie = {
          title: item.original_title,
          stitle: shorterTitle,
          description: item.overview,
          short: item.overview.substring(0,Math.min(50, item.overview.length)) + "...",
          rating: item.vote_average.toFixed(1),
          poster: "https://image.tmdb.org/t/p/w300" + item.poster_path,
          detail: "https://image.tmdb.org/t/p/w500" + item.backdrop_path,
          id: item.id,
          director: "Loading...",
          actors: []
        };
        $scope.inTheatres.push(newObjectForMovie);
        $scope.displayAbleMovies.push(newObjectForMovie);
        addActorsForMovie(newObjectForMovie);
      }
    }, function(err) {
      console.log(err);
    });
  };

  fetchLatestMovies();

  $scope.title = "HELLO WORLD!";

  $scope.displayAbleMovies = [];

  $scope.searchText = "";

  var request = null;

  var canceller = $q.defer();

  $scope.search = function(text) {
    $scope.displayAbleMovies.length = 0;
    if (text === undefined) {
      canceller.resolve();
      fetchLatestMovies();
    } else if (text.toLowerCase() === "my watchlist".toLowerCase() && $scope.user.loggedIn) {
      canceller.resolve();
      $scope.showWatchlist();
    } else {
      var url = "https://api.themoviedb.org/3/search/multi?api_key=18ec732ece653360e23d5835670c47a0&query=" + text;
      request = $http.get(url);
      request.then(function(response) {
        var array = response.data.results;
        for (var i = 0; i<array.length;i++) {
          var item = array[i];
          console.log(item);
          if (item.media_type !== "movie") {
            continue;
          }
          var shorterTitle;
          if (item.title) {
            shorterTitle = item.original_title.substring(0,Math.min(16, item.original_title.length));
          }
          if (shorterTitle.length < item.original_title.length) {
            shorterTitle = shorterTitle.substring(0,13) + "...";
          }
          var newObjectForMovie = {
            title: item.original_title,
            stitle: shorterTitle,
            description: item.overview,
            short: item.overview ? (item.overview.substring(0,Math.min(50, item.overview.length)) + "...") : "Not Description Available",
            rating: item.vote_average,
            poster: "https://image.tmdb.org/t/p/w300" + item.poster_path,
            detail: "https://image.tmdb.org/t/p/w500" + item.backdrop_path,
            id: item.id,
            director: "Loading...",
            actors: []
          };
          console.log(newObjectForMovie);
          $scope.displayAbleMovies.push(newObjectForMovie);
          addActorsForMovie(newObjectForMovie);
        }
      }, function(err) {
        console.log(err);
      });
    }
  };

  var addMovieFromID = function(id) {
    var url = "https://api.themoviedb.org/3/movie/" + id + "?api_key=18ec732ece653360e23d5835670c47a0";
    $http.get(url).then(function(response) {
      var item = response.data;
      var shorterTitle;
      if (item.title) {
        shorterTitle = item.original_title.substring(0,Math.min(16, item.original_title.length));
      }
      if (shorterTitle.length < item.original_title.length) {
        shorterTitle = shorterTitle.substring(0,13) + "...";
      }
      var newObjectForMovie = {
        title: item.original_title,
        stitle: shorterTitle,
        description: item.overview,
        short: item.overview ? (item.overview.substring(0,Math.min(50, item.overview.length)) + "...") : "Not Description Available",
        rating: item.vote_average,
        poster: "https://image.tmdb.org/t/p/w300" + item.poster_path,
        detail: "https://image.tmdb.org/t/p/w500" + item.backdrop_path,
        id: item.id,
        director: "Loading...",
        actors: []
      };
      console.log(newObjectForMovie);
      $scope.displayAbleMovies.push(newObjectForMovie);
      addActorsForMovie(newObjectForMovie);
    }, function(err) {
      console.log(err);
    });
  };

  $scope.showMoviesByActor = function(id, name) {
    $('.button-collapse').sideNav('hide');
    $scope.displayAbleMovies.length = 0;
    $scope.searchText = "Movies with: " + name;
    var url = "https://api.themoviedb.org/3/person/" + id + "/movie_credits?api_key=18ec732ece653360e23d5835670c47a0";
    $http.get(url).then(function(response) {
      var array = response.data.cast;
      for (var i = 0; i < Math.min(array.length,20); i++) {
        addMovieFromID(array[i].id);
      }
    }, function(err) {
      console.log(err);
    });
  };

  $scope.showWatchlist = function() {
    $scope.displayAbleMovies.length = 0;
    $scope.searchText = "My Watchlist";
    var url = "https://moviesbackend.herokuapp.com/watchlist?userid=" + $scope.user.id;
    console.log(url);
    $http.get(url).then(function(response) {
      var array = response.data;
      for (var i = 0; i < array.length; i++) {
        addMovieFromID(array[i]);
      }
    }, function(err) {

    });
  };

  $scope.logIn = function() {
    console.log("log In");
    FB.login(function(response) {
      console.log("Response is here");
        if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            $scope.user.id = response.authResponse.userID; //get FB UID
            FB.api('/me/picture', function(response) {
                $scope.user.image = response.data.url;
            });
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {
        scope: 'publish_stream,email'
    });
  };

  $scope.logOut = function() {
    console.log("log Out");
    $scope.user.loggedIn = false;
  };

  $scope.currentMovie = {
    video: $sce.trustAsResourceUrl("https://www.youtube.com/embed/YpZekJDrbvc?rel=0&amp;showinfo=0")
  };

  $scope.presentMovie = function(movie) {
    getTrailerForMovie(movie);
    console.log("Presenting!");
    $scope.currentMovie = movie;
    $('.button-collapse').sideNav('show');
  };


});
