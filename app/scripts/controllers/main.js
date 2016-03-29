/*主模块controller 入口
 * 注入图表子模块
 * 
 */
(function(window, undefined) {
	'use strict';
	angular.module('longll.controllers', [
		'controller.chartsModule',
		// 'controller.angularMode'
	]).controller('mainController', mainController);
    
    mainController.$inject = ['$scope', '$location'];
	function mainController($scope,$location) {
		  $scope.isActive = function(route) {
		    return route === $location.path();
		  };
		
	}


})(window);