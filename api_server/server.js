'use strict';

let express = require('express');
//显示请求信息
var logger = require('morgan');
var bodyParser = require("body-parser");

//引入文件
var film = require('./app/crawler/filmPrint');
var nuomiTitle = require('./app/crawler/getNuomiTitle');

let app = express();
var http = require('http').createServer(app);
let mysql = require('mysql');
let dbConfig = require('./db.json');

//定义抓数据  later
let later = require('later');
later.date.localTime();

//am  pm 
var sched = later.parse.text('at 9:15am every'),
  t = later.setTimeout(function() {
    test();
  }, sched);


/*
 *每个小时5分钟定义去查询当前电影票价格
 *
 */
function test() {
  console.log(new Date());
  console.log('我是每天10点来一遍哦');
  //把数据删掉
  //、、写方法
  delcine();
  getCine();
}



app.set('port', 18000);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// app.use(cookieParser);
http.listen(18000, function() {
  console.log('监听端口：18000');
});


/**
 * 测试爬虫 
 * 
 */
//测试根据电影院id爬一天的电影院场次
// film.getfilmPrint('16b1946c3a93bd2b2fb9083d');

// for (let i = 1; i < 7; i++) {
//   nuomiTitle.getNuomiTitle(i);
// }



var conn;
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

function getCine() {
  handleError();
  // where c.address like "%民治%"
  conn.query('select c.mid  from cinema c ',
    function(err, results, fields) {
      if (!err) {
        a(results);
      } else {
        throw err;
      }
    });
}

function a(result) {
  for (let i = 0; i < result.length; i++) {
    film.getfilmPrint(result[i].mid);
  }
}

function delcine(){
    handleError();
    conn.query('DELETE FROM cine', function (err, result) {
      if (err) throw err;

      console.log('deleted ' + result.affectedRows + ' rows');
    });
    conn.query('DELETE FROM screenings', function (err, result) {
      if (err) throw err;
      console.log('deleted ' + result.affectedRows + ' rows');
    });

}






//获取所有电影院场次


app.post('/api/getScreeningList', function(req, res) {
  // dbcineQuery.getCineList
  handleError();
  let sql='select distinct s.*,c.name as name from screenings s ,cine c  WHERE  c.cinemaid =s.cinemaid and c.mid= s.mid AND s.cinemaid = ?';
  conn.query(sql,req.query.mid,
    function(err, results, fields) {
      if (!err) {
        //处理数据
        return res.send({
          'code': '10000',
          'results': results
        });
      } else {
        throw err;
      }
    });

});

/**
 * [查询所有电影院]
 * @param  {[type]} req  [description]
 * @param  {[type]}             
 * @return {[type]}      [description]
 */
app.post('/api/getCineMaList', function(req, res) {
  // dbcineQuery.getCineList
  handleError();
  conn.query('select  c.mid,c.address,c.`name`,c.tel  from cinema c',
    function(err, results, fields) {
      if (!err) {
        return res.send({
          'code': '10000',
          'results': results
        });
      } else {
        throw err;
      }
    });
});

/**
 * [通过电影院id 获取电影院电影场次]
 * @param  {[type]} req    [description]
 * @param  {[type]} res){ } [description]
 * @return {[type]}        [description]
 */
app.post('/api/getMovieSiteByid', function(req, res) {
  handleError();
  let sql = 'SELECT distinct c.`name`,count(c.`name`) as value FROM cine c, screenings s WHERE c.cinemaid = ? AND s.cinemaid = c.cinemaid AND s.mid = c.mid group by c.`name` ORDER BY count(c.`name`) ';

  conn.query(sql, req.query.mid,
    function(err, results, fields) {
      if (!err) {
        return res.send({
          'code': '10000',
          'result': results
        });
      } else {
        throw err;
      }
    });

});