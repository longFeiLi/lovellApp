'use strict';
/**
 * 图表备注功能
 * 
 */
angular.module('controller.angularModule')
	.controller('gridlistCtrl', gridlistCtrl);
gridlistCtrl.$inject = ['$scope', 'comminService', 'uiGridConstants'];

function gridlistCtrl($scope, comminService, uiGridConstants) {
	$scope.title = '查询电影';
	$scope.myData = [];
	$scope.gridOptions = {
		showGroupPanel: true,
		enableCellSelection: true,
		enableRowSelection: true,
		enableCellEditOnFocus: true,
		paginationPageSizes: [10, 25, 50, 75],
		paginationPageSize: 10,
		enableFiltering: true, //过滤
		enableSorting: true,
		showGridFooter: true,
		enableFiltering: true,
		modifierKeysToMultiSelectCells: true,
		columnDefs: [{
			name: 'cinemaid',
			displayName: 'Id',
			visible: false,
			cellTooltip: true,
			headerTooltip: true
		}, {
			name: 'language',
			displayName: '厅'
		}, {
			name: 'name',
			displayName: '电影名'
		}, {
			name: 'price',
			displayName: '价格'
		}, {
			name: 'showtime',
			displayName: '播放时间'
		}, {
			name: 'version',
			displayName: '语言'
		}],
		onRegisterApi: function(gridApi) {
			$scope.gridApi = gridApi;
			$scope.gridApi.core.on.sortChanged($scope, function(grid, sort) {
				$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
			});
		},
	};


	//查询电影院
	comminService.getCineMaList(function(cinema) {
		$scope.cinemaList = cinema.results;
	});
    

   var moviescharts = echarts.init(document.getElementById('pieMovies'));
   $scope.pieMovies=function(results){
       var option = {
		    title : {
		        text: '电影占比图',
		        subtext: '',
		        x:'center'
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		        x : 'center',
		        y : 'bottom',
		        // data:['rose1','rose2','rose3','rose4','rose5','rose6','rose7','rose8']
		    },
		    toolbox: {
		        show : true,
		        feature : {
		            mark : {show: true},
		            dataView : {show: true, readOnly: false},
		            magicType : {
		                show: true,
		                type: ['pie', 'funnel']
		            },
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
		    },
		    calculable : true,
		    series : [
		        {
		            name:'半径模式',
		            type:'pie',
		            radius : [20, 110],
		            roseType : 'area',
		            label: {
	                normal: {
			              show: true,
			              formatter:function(v){
			              	return v.name+ '\n '+v.value +' 场' ;
			              }
	                },
	                emphasis: {
	                    show: true
	                }
			          },
		            data:results
		        }
		    ]
		};
		 moviescharts.setOption(option);
   };
  
   $scope.ckName=function(mid){
          //查询电影院电影
	    comminService.getMovieSiteByid({mid:mid},function(moviesList){
	    	console.log(moviesList.result);
	    	$scope.pieMovies(moviesList.result);
	    });
	    comminService.query({mid:mid},function(gridlist) {
				$scope.gridOptions.data = gridlist.results;
			});
   };

}