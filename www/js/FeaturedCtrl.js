app.controller('FeaturedCtrl', function ($rootScope, $http, DataManager) {
  DataManager.load();
  $rootScope.displayAbleMovies = DataManager.featured();
  $rootScope.searchText = "";
  $rootScope.title = "Featured";
  $rootScope.progress = function() {
    return $rootScope.displayAbleMovies.length === 0;
  };
});
