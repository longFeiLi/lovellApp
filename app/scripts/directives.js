// 文字作品列表
(function(module) {
  var workwords = function(WorksService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: function(elem, attrs) {
        return 'views/template/subChart.html';
      },
      link: function(scope, element, attrs) {

        getList();

        function getList() {
          WorksService.getByActiveWord({
              activity_id: activity_id,
              page: scope.current_page,
              nums: nums
            })
            .success(function(rsp) {
              if (rsp.err === 0) {
                Array.prototype.push.apply(scope.list, rsp.data);
                scope.total = rsp.total;
                scope.hasMore = scope.current_page * nums < scope.total;
              } else if (rsp.err === 1005) {
                scope.hasMore = false;
              }
            });
        }

      }
    }
  }
  module.directive('workwords', ['WorksService', workwords]);
})(angular.module('reactLeadApp'));