app.controller('MovieCtrl', function ($scope, $rootScope, $routeParams, DataManager) {
  if ($routeParams.id) {
    DataManager.getMovie($routeParams.id,function(movie){
      $scope.currentMovie = movie;
      $scope.text = DataManager.isInWatchlist(movie) ? "Remove from Watchlist" : "Add to Watchlist";
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
