'use strict';

// Declare app level module which depends on views, and components
angular.module('dcbiaOrtholab', [
  'ngRoute',
  'ui.bootstrap',
  'smart-table',
  'file-model',
  'jwt-user-login',
  'nav-bar',
  'dcbia-projects',
  'data-collections',
  'home',
  'dcbia-surveys',
  'dcbia-plots',
  'clusterpost-list'
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
    templateUrl: 'home/home.template.html'
  })
  .when('/clinicalData', {
    templateUrl: './home/clinicalData.template.html',
    reloadOnSearch: false
  })
  .when('/morphologicalData', {
    templateUrl: './home/morphologicalData.template.html'
  })
  .when('/projects', {
    templateUrl: './home/dcbia-projects.template.html'
  })
  .when('/jobs', {
    templateUrl: './home/dcbia-jobs.template.html'
  })  
  .when('/login/reset', {
    templateUrl: 'home/login.html'
  })
  .when('/users', {
    templateUrl: 'home/users.html'
  })
  .when('/tasks', {
    templateUrl: 'home/tasks.html'
  })
  .when('/notFound', {
    templateUrl: 'home/notFound.html'
  })
  .otherwise({redirectTo: '/home'});
}]);
