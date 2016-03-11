app.controller('SearchCtrl', function ($scope, $rootScope, $routeParams, DataManager) {
  $rootScope.displayAbleMovies = [];
  if ($routeParams.query) {
    $rootScope.searchText = $routeParams.query;
    $rootScope.title = $routeParams.query;
    DataManager.search($routeParams.query,function(items){
      $rootScope.displayAbleMovies = items;
      if (items.length === 0) {
        $rootScope.progress = function() {
          return false;
        };
      }
    });
  }
  $rootScope.progress = function() {
    return $rootScope.displayAbleMovies.length === 0;
  };
});
