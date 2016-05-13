var app = angular.module('movies', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
  when('/', {
    templateUrl: 'featured.html',
    controller: 'FeaturedCtrl'
  }).
  when('/movie/:id', {
    templateUrl: 'movie.html',
    controller: 'MovieCtrl'
  }).
  when('/tickets/:id', {
    templateUrl: 'tickets.html',
    controller: 'TicketsCtrl'
  }).
  when('/person/:id',{
    templateUrl: 'person.html',
    controller: 'PersonCtrl'
  }).
  when('/search/:query',{
    templateUrl: 'search.html',
    controller: 'SearchCtrl'
  }).
  when('/me/watchlist',{
    templateUrl: 'watchlist.html',
    controller: 'WatchlistCtrl'
  }).
  when('/404',{
    templateUrl: '404.html',
    controller: 'NotFoundCtrl'
  }).
  otherwise({
    redirectTo: '/404'
  });
  $locationProvider.html5Mode(true);
}]);
