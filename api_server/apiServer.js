'use strict';

var express = require('express'),
	fixtures = require('./fixtures');
// var path=require('path');
// var favicon=require('serve-favion');
//显示请求信息
var logger = require('morgan');

// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var http = require('http').createServer(app);


app.set('port', 18000);
app.use(logger('dev'));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

// app.use(cookieParser);

http.listen(18000, function() {
	console.log('监听端口：18000');
});

app.get('/', function(req, res) {
	res.send('hello world');
});

app.get('/reactLead/text', function(req, res) {
	res.send("hello word!");
});

app.post('/reactLead/common/updateOrSave', function(req, res) {
	res.send(fixtures);
});