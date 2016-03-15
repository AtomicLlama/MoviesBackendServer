app.controller('MovieCtrl', function ($scope, $rootScope, $routeParams, DataManager) {
  if ($routeParams.id) {
    DataManager.getMovie($routeParams.id,function(movie){
      $scope.currentMovie = movie;
      $rootScope.title = movie.title;
      $scope.isInWatchlist = DataManager.isInWatchlist(movie);
      $scope.toggle = function() {
        $rootScope.toggleWatchlist(movie);
        $scope.isInWatchlist = !$scope.isInWatchlist;
      };
    },$rootScope.notFound);
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
