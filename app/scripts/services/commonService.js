'use strict';

/**
 * 公共服务 
 */
angular.module('longll.services',[]).service('comminService', comminService);

comminService.$inject = ['Restangular'];

/**
 * [comminService description]
 * @param  {[type]} Restangular [description]
 * @return {[type]}             [description]
 */
function comminService(Restangular) {
	return {
		query: query,
		getCineMaList:getCineMaList,
		getMovieSiteByid:getMovieSiteByid
	};

	function query(param,callback) {
		Restangular.all('/api/getScreeningList').post("",param).then(callback);
	}
	function getCineMaList(callback) {
		Restangular.one('/api/getCineMaList').post().then(callback);
	}
	function getMovieSiteByid(param,callback){
		console.log(param);
		Restangular.all('/api/getMovieSiteByid').post("mid",param).then(callback);
	}


}