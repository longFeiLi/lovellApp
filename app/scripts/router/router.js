 'use strict';
 /**
  * 所有配置路由功能
  */
 angular.module('reactLeadApp')
   .config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {
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
             controller:'mainController'

           }
         }
       })
       .state('chartRemark',{
         url:'/chartRemark', 
         views:{
           'view':{
              templateUrl:'views/echarts/chartRemark.html',
              conrroller:'chartsModule'
           }

         }
       });



   }]);