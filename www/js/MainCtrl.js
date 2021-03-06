app.controller('MainCtrl', function ($rootScope, $http, $location, DataManager,$window) {

  $rootScope.stack = [];
  $rootScope.fullStack = [];
  $rootScope.searchText = "";
  $rootScope.user = {
    name: "",
    id: "",
    token: "",
    loggedIn: false,
    image: ""
  };

  $rootScope.search = function(text) {
    if (text === undefined) {
      $location.path("/");
    } else {
      var path = $location.$$path;
      path = path.split("/");
      if (path[1] === "search") {
        $location.path("/search/" + text).replace();
      } else {
        $location.path("/search/" + text);
      }
    }
  };

  $rootScope.presentMovie = function(movie) {
    $location.path("/movie/" + movie.id);
  };

  $rootScope.presentPerson = function(person) {
    $location.path("/person/" + person.id);
  };

  $rootScope.buyTickets = function(movie) {
    $location.path("/tickets/" + movie.id);
  };

  $rootScope.notFound = function() {
    $location.path("/404");
  };

  $rootScope.goToWatchlist = function() {
    $location.path("/me/watchlist");
  };

  $rootScope.home = function() {
    $location.path("/");
  };

  var login = function(response) {
    if (response.authResponse) {
        console.log(response.authResponse);
        $rootScope.user.id = response.authResponse.userID; //get FB UID
        $rootScope.user.loggedIn = true;
        $rootScope.user.token = response.authResponse.accessToken;
        FB.api('/me/picture', function(response) {
            $rootScope.user.image = response.data.url;
        });
        FB.api('/me',function(response) {
          $rootScope.user.name = response.name;
        });
        DataManager.load($rootScope.user);
        $(document).ready(function(){
          $('.dropdown-button').dropdown();
        });
    } else {
        console.log('User cancelled login or did not fully authorize.');
    }
  };

  $rootScope.logIn = function() {
    FB.login(login, {
        scope: "public_profile,email,user_friends"
    });
  };

  $rootScope.toggleWatchlist = function(movie) {
    DataManager.toggleWatchlist($rootScope.user, movie);
  };

  $rootScope.iconForMovie = function(movie) {
    return DataManager.isInWatchlist(movie) ? "remove circle" : "add circle";
  };

  $rootScope.classForMovieCard = function() {
    var width = document.getElementById('Featured').offsetWidth;
    if (width < 600) return "col s12";
    return "col s4";
  };

  $rootScope.logOut = function() {
    $rootScope.user.loggedIn = false;
  };

  FB.getLoginStatus(function(response) {
    console.log(response);
    if (response.status === 'connected') {
      login(response);
    }
  });

});
