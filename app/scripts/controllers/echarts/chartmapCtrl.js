'use strict';
/**
 * 图表备注功能
 * 
 */
angular.module('controller.chartsModule')
	.controller('chartmapCtrl', chartmap);
chartmap.$inject = ['$scope', 'comminService'];

function chartmap($scope, comminService) {
	$scope.title = 'zhangsan';

	// szCharts
	var szMycharts = echarts.init(document.getElementById('szCharts'));
	var option = {
		tooltip: {
			trigger: 'item',
			formatter: '{b}'
		},
		series: [{
			name: '中国',
			type: 'map',
			mapType: '广东',
			selectedMode: 'multiple',
			label: {
				normal: {
					show: true
				},
				emphasis: {
					show: true
				}
			},
			data: [{
				name: '广东',
				selected: true
			}]
		}]
	};
	szMycharts.setOption(option);

}