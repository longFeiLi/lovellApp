"use strict";

var mysql = require('mysql');
var dbConfig = require('../db.json');


//连接数据库测试
var conn = mysql.createConnection(dbConfig);
// conn.connect();
// conn.query('select * from user', function(err, rows, fielde) {
// 	if (err) {
// 		throw err;
// 	}
// 	console.log(rows);
// 	console.log(fielde);
// 	console.log('连接数据库成功');
// });

// conn.end();

/**
 * [insertContent 插入正文内容到数据库]
 * @return {[type]} [description]
 */
// var post  = {id: 1, title: 'Hello MySQL'};
// var query = connection.query('INSERT INTO posts SET ?', post, function(err, result) {
//   // Neat!
// });
function insertContent(sql, oData) {
 
  // console.log(oData);
	conn.connect();
	for (var i = 0; i < oData.length; i++) {
		 var sSql=sql+" ( '"+i+"','"+oData[i].title+"','"+oData[i].href+"')";
     console.log(sSql);
		conn.query(sSql, function(err, rows) {
			if (err) {
				throw err;
			}
			console.log("成功了");
			

		});
	}
	conn.end();

}


exports.insertContent = insertContent;