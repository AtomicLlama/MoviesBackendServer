app.controller('MainCtrl', function ($rootScope, $http, $location, DataManager,$window) {

  $rootScope.stack = [];
  $rootScope.fullStack = [];
  $rootScope.searchText = "";
  $rootScope.user = {
    name: "",
    id: "",
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

  $rootScope.logIn = function() {
    FB.login(function(response) {
        if (response.authResponse) {
            console.log(response.authResponse);
            $rootScope.user.id = response.authResponse.userID; //get FB UID
            $rootScope.user.loggedIn = true;
            FB.api('/me/picture', function(response) {
                $rootScope.user.image = response.data.url;
            });
            FB.api('/me',function(response) {
              $rootScope.user.name = response.name;
            });
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {
        scope: "public_profile,email,user_friends"
    });
  };

  $rootScope.logOut = function() {
    $rootScope.user.loggedIn = false;
  };

});
