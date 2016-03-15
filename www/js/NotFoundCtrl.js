app.controller('NotFoundCtrl', function ($scope, $rootScope) {
  $rootScope.searchText = "";
  $rootScope.displayAbleMovies = [];
  $rootScope.title = "404 - Not Found";
  $rootScope.progress = function() {
    return false;
  };
  $(document).ready(function(){
      $('.parallax').parallax();
    });
});
