var app = angular.module('movies', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {
    templateUrl: 'featured.html',
    controller: 'FeaturedCtrl'
  }).
  when('/movie/:id', {
    templateUrl: 'movie.html',
    controller: 'MovieCtrl'
  }).
  when('/person/:id',{
    templateUrl: 'person.html',
    controller: 'PersonCtrl'
  }).
  when('/search/:query',{
    templateUrl: 'search.html',
    controller: 'SearchCtrl'
  }).
  when('/watchlist',{
    templateUrl: 'watchlist.html',
    controller: 'WatchlistCtrl'
  }).
  otherwise({
    redirectTo: '/'
  });
}]);
