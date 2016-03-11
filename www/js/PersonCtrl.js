app.controller('PersonCtrl', function ($scope, $rootScope, $routeParams, DataManager) {
  $rootScope.displayAbleMovies = [];
  if ($routeParams.id) {
    DataManager.getPerson($routeParams.id,function(person){
      $scope.currentPerson = person;
      $rootScope.displayAbleMovies = person.movies;
      $rootScope.title = person.name;
    });
  }
  $rootScope.searchText = "";
  $rootScope.progress = function() {
    return $rootScope.displayAbleMovies.length === 0;
  };
});
