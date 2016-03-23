 'use strict';
 /**
  * 所有配置路由功能
  */
 angular.module('reactLeadApp')
   .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
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
             controller: 'mainController'

           }
         }
       })
       .state('chartRemark', {
         url: '/chartRemark',
         views: {
           'view': {
             templateUrl: 'views/echarts/chartRemark.html',
             conrroller: 'remarkEchartsCtrl'
           }

         }
       })
       .state('bMapChart', {
         url: '/bMapChart',
         views: {
           'view': {
             templateUrl: 'views/echarts/bMapEcharts.html',
             conrroller: 'bMapController'
           }

         }
       })
       .state('ngGrid', {
         url: '/ngGrid',
         views: {
           'view': {
             templateUrl: 'views/angular/ngGrid.html',
             conrroller: 'ngGridController'
           }

         }
       })
      .state('login', {
         url: '/login',
         views: {
           'view': {
             templateUrl: 'views/login.html',
             // conrroller: 'ngGridController'
           }

         }
       })



       ;



   }]);