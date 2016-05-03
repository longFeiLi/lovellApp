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
    'restangular',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.cellNav',
    'ui.grid.pagination',
    'datatables',
    'longll.controllers',
    'longll.services'
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
       })
      .state('gridlist', {
         url: '/gridlist',
         views: {
           'view': {
             templateUrl: 'views/gridlist.html',
           }
         }
       })
      .state('chartsmap', {
         url: '/chartsmap',
         views: {
           'view': {
             templateUrl: 'views/mapChartsz.html',
           }
         }
       })
       .state('work', {
         url: '/work',
         views: {
           'view': {
             templateUrl: 'views/work.html',
           }
         }
       });

    // $locationProvider.html5Mode(true);
  });

App.config(['$locationProvider', function($locationProvider) {  
  // $locationProvider.html5Mode(true);  
}]);





