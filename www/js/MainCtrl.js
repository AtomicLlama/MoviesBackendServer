app.controller('MainCtrl', function ($rootScope, $http, $location, DataManager,$window) {

  $rootScope.stack = [];

  $rootScope.fullStack = [];

  $rootScope.user = {
    name: "",
    id: "",
    loggedIn: false,
    image: ""
  };

  $rootScope.search = function(text) {
    if (text === undefined) {
      $location.path("/");
    } else if (text.toLowerCase() === "my watchlist".toLowerCase() && $scope.user.loggedIn) {

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

  $rootScope.logIn = function() {
    FB.login(function(response) {
        if (response.authResponse) {
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

  $rootScope.logOut = function() {
    console.log("log Out");
    $scope.user.loggedIn = false;
  };

});
