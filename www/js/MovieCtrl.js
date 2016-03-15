app.controller('MovieCtrl', function ($scope, $rootScope, $routeParams, DataManager) {
  if ($routeParams.id) {
    DataManager.getMovie($routeParams.id,function(movie){
      $scope.currentMovie = movie;
      $rootScope.title = movie.title;
    });
  }
  $rootScope.searchText = "";
  $rootScope.displayAbleMovies = [];
  $rootScope.progress = function() {
    return false;
  };
  $(document).ready(function(){
      $('.parallax').parallax();
    });
});
