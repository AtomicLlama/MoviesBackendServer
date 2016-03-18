app.controller('WatchlistCtrl', function ($scope, $rootScope, $routeParams, DataManager) {
  $rootScope.displayAbleMovies = [];
  $rootScope.searchText = "";
  $rootScope.progress = function() {
    return $rootScope.displayAbleMovies.length === 0;
  };
  DataManager.getWatchlist($rootScope.user,function(list) {
    $rootScope.displayAbleMovies = list;
  });
});
