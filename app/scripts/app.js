'use strict';

/**
 * @ngdoc overview
 * @name appleApp
 * @description
 * # appleApp
 *
 * Main module of the application.
 */
var App=angular
  .module('appleApp', [
    'ngCookies',
    'ngRoute',
    'ui.router',
    'ngTouch',
    'longll.controllers'
  ]);

  App.config(function ($stateProvider,$urlRouterProvider) {

     $urlRouterProvider.otherwise('/main');
     //路由配置
     $stateProvider.state('main', {
         url: '/main',
         views: {
           'view': {
             templateUrl: 'views/index.html'
           }
         }
     })
      .state('contact', {
         url: '/contact',
         views: {
           'view': {
             templateUrl: 'views/contact.html',
           }
         }
       });
    // $locationProvider.html5Mode(true);
  });

App.config(['$locationProvider', function($locationProvider) {  
  $locationProvider.html5Mode(true);  
}]);





