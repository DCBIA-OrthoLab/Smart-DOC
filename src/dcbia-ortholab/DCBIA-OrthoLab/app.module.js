'use strict';

// Declare app level module which depends on views, and components
angular.module('cTRIVIAL', [
  'ngRoute',
  'ui.bootstrap',
  'smart-table',
  'ngFilemodel',
  'jwt-user-login',
  'nav-bar',
  'users-manager',
  'morphological-data',
  'clinical-data',
  'home',
  'dcbia-surveys',
  'dcbia-plots'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {
    redirectTo: '/login'
  })
  .when('/login', {
    templateUrl: 'home/login.html'
  })
  .when('/home', {
    templateUrl: 'node_modules/home/home.template.html'
  })
  .when('/clinicalData', {
    templateUrl: 'node_modules/clinical-data/src/clinicalData.template.html',
    reloadOnSearch: false
  })
  .when('/morphologicalData', {
    templateUrl: 'node_modules/morphological-data/src/morphologicalData.template.html'
  })
  .when('/importClinicalData', {
    templateUrl: 'views/controllers/importClinicalData.html'
  })
  .when('/login/reset', {
    templateUrl: 'home/login.html'
  })
  .when('/users', {
    templateUrl: 'node_modules/users-manager/src/usersManager.template.html'
  })
  .when('/notFound', {
    templateUrl: 'home/notFound.html'
  })
  .otherwise({redirectTo: '/home'});
}]);
