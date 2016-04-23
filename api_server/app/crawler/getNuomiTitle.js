"use strict";
/**
 * 抓取电影院列表
 * http://www.nuomi.com/xuanzuo/0-0/subd/cb0-d10000-s0-o12-b1-f1?pn=1 
 * 总共6页 
 */

let async = require('async');
let request = require('request');
let cheerio = require('cheerio');

let mysql = require('mysql');
var dbConfig = require('../../db.json');
let conn;

function handleError() {
	conn = mysql.createConnection(dbConfig);
	//连接错误，2秒重试
	conn.connect(function(err) {
		if (err) {
			console.log('error when connecting to db:', err);
			setTimeout(handleError, 2000);
		}
	});

	conn.on('error', function(err) {
		console.log('db error', err);
		// 如果是连接断开，自动重新连接
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			handleError();
		} else {
			throw err;
		}
	});
}


let getNuomiTitle = function(id) {
	handleError();
	async.parallel([
		function(callback) {
			//查询nuomi 
			request({
				url: 'http://www.nuomi.com/xuanzuo/0-0/subd/cb0-d10000-s0-o12-b1-f1?pn=' + id,
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.80 Safari/537.36'
				}
			}, function(err, response, body) {
				if (body) {
					var $ = cheerio.load(body);
					var results = [];
					$('.cinema').each(function() {
						let item = {};
						// console.log($(this).find('.cib-name a').text());
						item.address = $(this).find('.cib-address p').text();
						item.tel = $(this).find('.cib-tel').text().replace(/[\r\n]/g, "");
						item.name = $(this).find('.cib-name a').text();
						item.mid = $(this).find('.cib-name a').attr('href').split('/')[2];
						item.date = new Date();
						results.push(item);
					});
					// console.log(results);
					//插入到数据库
					insertTable('cinema', results);
				     // callback();
			}
			});
		},
		function(callback) {
			callback();
		}
	], function(err, results) {
		// conn.connect();
		// getPrint(results[0]);
		// console.log('ok');

	});

};


/**
 * [insertCine 插入cine表数据 ]
 * @return {[type]} [description]
 */
function insertTable(table, oResult) {
	for (var i = 0; i < oResult.length; i++) {
		conn.query('INSERT INTO '+table+' SET ?',oResult[i], function(err) {
			if (err) {
				return conn.rollback(function() {
					throw err;
				});
			}
		});
		// conn.end();
	}
}


exports.getNuomiTitle = getNuomiTitle;