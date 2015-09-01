'use strict';
/**
 * ng-grid图表功能
 * 
 */
angular.module('controller.angularMode', [])
	.controller('ngGridController', ngGridCtil);
ngGridCtil.$inject = ['$scope','uiGridConstants'];

function ngGridCtil($scope,uiGridConstants) {
	$scope.myData = [{
		name: "Moroni",
		age: 50
	}, {
		name: "Tiancum",
		age: 43
	}, {
		name: "Jacob",
		age: 27
	}, {
		name: "Nephi",
		age: 29
	}, {
		name: "Enos",
		age: 34
	}];
	$scope.gridOptions = {
		data: $scope.myData,
		showGroupPanel: true,
		enableCellSelection: true,
		enableRowSelection: true,
		enableCellEditOnFocus: true,
		enableFiltering: true, //过滤
		columnDefs: [{
				field: 'name',
				displayName: 'Name',
				enableCellEdit: true
			}, {
				field: 'age',
				displayName: 'Age',
				enableCellEdit: true,
				filters: [{
					condition: uiGridConstants.filter.GREATER_THAN,
					placeholder: 'greater than'
				}, {
					condition: uiGridConstants.filter.LESS_THAN,
					placeholder: 'less than'
				}],
				headerCellClass: $scope.highlightFilteredHeader
			}

		]

	};

}