//链接：http://sz.nuomi.com/cinema/30d2ec870032758bc26c14af
"use strict";

var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var dbConfig = require('../../db.json');
var mysql = require('mysql');

var conn = mysql.createConnection(dbConfig);

/**
 * [getfilmPrint description]
 * @param  {[type]} cinemaid [description]
 * @return {[type]}          [description]
 */
var getfilmPrint = function(cinemaid) {
	async.parallel([
		function(callback) {
			//查询nuomi /cinema/0ed20a15b8209b8e57bfff
			request({
				url: 'http://sz.nuomi.com/cinema/' + cinemaid,
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.80 Safari/537.36'
				}
			}, function(err, response, body) {
				if (body) {

					var $ = cheerio.load(body);
					var results = [];
					$('.j-hot-item-wrap .j-img-wrapper').each(function() {
						var item = {};
						item.mid = $(this).attr('movieid');
						item.name = $(this).find('img').attr('alt');
						item.cinemaid = cinemaid;
						item.date = new Date();
						results.push(item);
					});
					// console.log(results);
					//插入到数据库
					insertCine(results);

					callback(null, results);
				}
			});
		},
		function(callback) {
			callback();
		}
	], function(err, results) {
		getPrint(results[0]);
	});
};



/**
 * [insertCine 插入cine表数据 ]
 * @return {[type]} [description]
 */
function insertCine(result) {
	//打开数据库连接
	// conn.connect();
	for (var i = 0; i < result.length; i++) {
		conn.query('INSERT INTO cine SET ?', result[i], function(err, result) {
			if (err) {
				return conn.rollback(function() {
					throw err;
				});
			}
		});
	}
	// conn.end();
}

/**
 * [getPrint 获取电影院场次时间票价]
 * @param  {[type]} resulePrint [电影院名字]
 * @return {[type]}             [description]
 */
function getPrint(resulePrint) {
	//需要获取具体的票价和场次

	//http://sz.nuomi.com/pcindex/main/timetable?cinemaid=30d2ec870032758bc26c14af&mid=9925&needMovieInfo=1&tploption=1&_=1460369526412
	for (var i = 0; i < resulePrint.length; i++) {
		// console.log(resulePrint[i]);
		let url = 'http://sz.nuomi.com/pcindex/main/timetable?cinemaid=' + resulePrint[i].cinemaid + '&mid=' + resulePrint[i].mid + '&needMovieInfo=1&tploption=1&_=1460369526412';
		let options = {
			url: url,
			headers: {
				'User-Agent': 'request',
				'cinemaid': resulePrint[i].cinemaid,
				'mid': resulePrint[i].mid,
			}
		};

		function callback(error, response, body) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				//打开数据库连接
				let oResult = [];
				$('#j-movie-list0 .table tr').each(function() {
					var item = {};
					item.cinemaid = options.headers.cinemaid;
					item.mid = options.headers.mid;
					item.showTime = $(this).find('td').eq(0).text().replace(/[\r\n]/g, "");
					item.version = $(this).find('td').eq(1).text();
					item.language = $(this).find('td').eq(2).text();
					item.price = $(this).find('td').eq(3).find('.nuomi-price').text().replace(/[\r\n]/g, "");
					item.data = new Date();
					oResult.push(item);

				});
				insertScreenings(oResult);
			}

		}

		request(options, callback);
		// console.log(oResult);

	}
}



/**
 * [insertCine 插入cine表数据 ]
 * @return {[type]} [description]
 */
function insertScreenings(oResult) {
	for (var i = 0; i < oResult.length; i++) {
		conn.query('INSERT INTO screenings SET ?', oResult[i], function(err) {
			if (err) {
				return conn.rollback(function() {
					throw err;
				});
			}
		});
		// conn.end();
	}
}



exports.getfilmPrint = getfilmPrint;