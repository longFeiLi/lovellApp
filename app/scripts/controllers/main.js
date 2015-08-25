/*主模块controller 入口
 * 注入图表子模块
 * 
 */
(function(window, undefined) {
	'use strict';
	angular.module('reactLead.controllers', [
		'controller.chartsModule'
	]).controller('mainController', mainController);

	function mainController() {
		
		
	}
})(window);