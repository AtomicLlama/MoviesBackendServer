app.controller('MovieCtrl', function ($scope, $rootScope, $routeParams, DataManager) {
  if ($routeParams.id) {
    DataManager.getMovie($routeParams.id,function(movie){
      $scope.currentMovie = movie;
      $rootScope.title = movie.title;
    });
  }
  $rootScope.searchText = "";
  $scope.widthOfDetail = function() {
    var width = document.getElementById('images').offsetWidth;
    var posterWidth = document.getElementById('poster').offsetWidth;
    return width - posterWidth - 0.5;
  };
  $rootScope.displayAbleMovies = [];
  $rootScope.progress = function() {
    return false;
  };
});
