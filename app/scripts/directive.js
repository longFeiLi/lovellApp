// 左侧工具栏
(function(module){
  var leftool = function($location){
    return {
      restrict : 'E',
      replace : true,
      templateUrl: function(elem, attrs){
        return 'views/template/subTool.html';
      },
      link:function(scope, el, attr) {  
        scope.isSelected=$location.path();
      }  
    };
  };
  module.directive('leftool',['$location',leftool]);
})(App);