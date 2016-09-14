'use strict';

// Declare app level module which depends on views, and components
angular.module('cTRIVIAL', [
  'ngRoute',
  'ui.bootstrap',
  'smart-table',
  'file-model',
  'jwt-user-login',
  'nav-bar',
  'clinical-markers',
  'diagnostic-temporo-mandibular',
  'users-manager',
  'morphological-data',
  'clinical-data',
  'home',
  'tmj-survey',
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
    templateUrl: 'bower_components/home/home.template.html'
  })
  .when('/clinicalData', {
    templateUrl: 'bower_components/clinical-data/clinicalData.template.html',
    reloadOnSearch: false
  })
  .when('/morphologicalData', {
    templateUrl: 'bower_components/morphological-data/morphologicalData.template.html'
  })
  .when('/importClinicalData', {
    templateUrl: 'views/controllers/importClinicalData.html'
  })
  .when('/login/reset', {
    templateUrl: 'home/login.html'
  })
  .when('/users', {
    templateUrl: 'bower_components/users-manager/usersManager.template.html'
  })
  .when('/notFound', {
    templateUrl: 'home/notFound.html'
  })
  .otherwise({redirectTo: '/home'});
}]);
