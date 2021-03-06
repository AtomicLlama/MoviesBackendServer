app.controller('TicketsCtrl', function ($scope, $rootScope, $routeParams, DataManager) {
  if ($routeParams.id) {
    DataManager.getMovie($routeParams.id,function(movie){
      $scope.currentMovie = movie;
      $rootScope.title = "Ticket for " + movie.title;
    },$rootScope.notFound);
  }
  $rootScope.searchText = "";
  $rootScope.displayAbleMovies = [];
  $rootScope.progress = function() {
    return false;
  };
  $(document).ready(function(){
    $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
  });

  $scope.getLocation = function(use) {
    if (use && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(loc) {
        $scope.location = loc.coords;
        $scope.fetchTimes();
      });
    }
  };

  $scope.selectShow = function(selected) {
    $scope.selectedShow = selected;
  };

  $scope.fetchTimes = function() {
    if ($scope.location && $scope.date) {
      $scope.loading = true;
      $scope.selectedShow = undefined;
      DataManager.getShowtimes($rootScope.user, $scope.currentMovie.id,$scope.location,$scope.date,function(showtimes) {
        var cinemas = [];
        var i;
        for (i = 0; i < showtimes.length; i++) {
          if (cinemas.indexOf(showtimes[i].name)) {
            cinemas.push(showtimes[i].name);
          }
        }
        var copy = cinemas.map(function (x) {
          return {
            name: x,
            times: []
          };
        });
        for (i = 0; i < showtimes.length; i++) {
          var time = showtimes[i];
          var index = cinemas.indexOf(time.name);
           copy[index].times = copy[index].times.concat(time.showtimes.map(function(x) {
            return {
              film: time.film,
              time: x
            };
          }));
        }
        $scope.cinemas = copy;
        $scope.loading = false;
      });
    }
  };

  $scope.changeTimes = function() {
    $scope.selectedCinema = $scope.cinemas[document.getElementById('select').value];
    $scope.selectedShow = undefined;
  };

  $scope.dateToString = function(date) {
    var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
    var day = date.getDate();
    var month = monthNames[date.getMonth()];
    var year = date.getFullYear();
    return day + " " + month + ", " + year;
  };

  $scope.addFriend = function(friend) {
    if (friend) {
      $scope.friends.push(friend);
      $scope.facebook.splice($scope.facebook.indexOf(friend),1);
      $('#modal1').closeModal();
    } else if ($scope.facebook) {
      $('#modal1').openModal();
    } else {
      FB.api('me/friends',{fields: "name,picture.height(150)"}, function(response) {
        $scope.facebook = response.data.map(function(friend) {
          return {
            name: friend.name,
            id: friend.id,
            image: friend.picture.data.url,
            deletable: true
          };
        });
        $('#modal1').openModal();
      });
    }
  };

  $scope.loading = false;

  $scope.removeFriend = function(friend) {
    $scope.facebook.push(friend);
    $scope.friends.splice($scope.friends.indexOf(friend),1);
  };

  // Data

  $scope.date = $scope.dateToString(new Date());
  $scope.cinemas = [];
  $scope.numberOfSeats = 1;
  $scope.friends = [{
    name: "You",
    id: $rootScope.user.id,
    image: $rootScope.user.image,
    deletable: false
  }];

  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15 // Creates a dropdown of 15 years to control year
  });
  $(document).ready(function() {
    $('select').material_select();
  });

});
