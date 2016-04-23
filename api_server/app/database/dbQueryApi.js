'use strict';
let dbConfig = require('../../db.json');
let mysql = require('mysql');

let conn = mysql.createConnection(dbConfig);


/**
 * [getCineList 获取电影院美团的数据]
 * @return {[type]} [description]
 */
let getCineList=function() {
	var oresults={};
	conn.connect();
	conn.query('select c.name,s.* from cine c ,screenings s  WHERE c.cinemaid=s.cinemaid and s.mid=c.mid', 
		function (err, results, fields) {
		   if(!err){
	          oresults= results;
	          // next();
	        }
	        else{
	          throw err;
	        }
		  // console.log(results);
		  oresults=results;
	});
	conn.end();
  return oresults;
};



exports.getCineList = getCineList;












