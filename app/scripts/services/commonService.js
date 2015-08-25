'use strict';

/**
 * 公共服务 
 */
angular.module('reactLead.services',[]).service('comminService', comminService);

comminService.$inject = ['Restangular'];

/**
 * [comminService description]
 * @param  {[type]} Restangular [description]
 * @return {[type]}             [description]
 */
function comminService(Restangular) {
	return {
		query: query
	};

	function query(callback) {
		Restangular.one('reactLead/text').get().then(callback);
	}


}