"use strict";

var http = require('http');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var bufferHelper = require('bufferhelper');
var dbQuery=require('./dbQuery');


var url = 'http://shenzhen.8264.com';


http.get(url, function(res) {

	var buffer = new bufferHelper();
	res.on('data', function(data) {
		buffer.concat(data);
	});
	res.on('end', function() {
		var str = iconv.decode(buffer.toBuffer(), 'gbk');
		var urlData = filterChapters(str);
		dbQuery.insertContent('insert into Content VALUES ',urlData);
	});

});


function filterChapters(html) {
	var $ = cheerio.load(html);
	var content = $('.title_o_t_s h2');
	var urlContent = [];
	content.each(function() {
		var oData = {
			title: $(this).text(),
			href: $(this).find('a').attr('href')
		};
		urlContent.push(oData);
	});
	return urlContent;
}