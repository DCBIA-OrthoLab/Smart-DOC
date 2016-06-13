'use strict';

// Declare app level module which depends on views, and components
angular.module('cTRIVIAL', [
  'ngRoute',
  'ui.bootstrap',
  'smart-table',
  'file-model'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {
    redirectTo: '/login'
  })
  .when('/login', {
    templateUrl: 'views/controllers/login.html'
  })
  .when('/home', {
    templateUrl: 'views/controllers/home.html'
  })
  .when('/clinicalData', {
    templateUrl: 'views/controllers/clinicalData.html'
  })
  .when('/importClinicalData', {
    templateUrl: 'views/controllers/importClinicalData.html'
  })
  .when('/login/reset', {
    templateUrl: 'views/controllers/login.html'
  })
  .when('/notFound', {
    templateUrl: 'views/controllers/notFound.html'
  })
  .otherwise({redirectTo: '/home'});
}]);
