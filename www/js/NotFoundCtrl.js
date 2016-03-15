app.controller('NotFoundCtrl', function ($scope, $rootScope) {
  $rootScope.searchText = "";
  $rootScope.displayAbleMovies = [];
  $rootScope.progress = function() {
    return false;
  };
  $(document).ready(function(){
      $('.parallax').parallax();
    });
});
