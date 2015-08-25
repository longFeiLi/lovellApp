'use strict';

/*----------可视化图表相关公共方法函数------------*/
angular.module('reactLead.services').service('RemarkService', ['Restangular', fRemarkService]);

function fRemarkService(Restangular) {
  var aRemarkCharts = {}; //所有备注保存chart实例
  var aRemarkParam = '';
  var chartReark = {}; //图表实例chart  var chartKey='';
  var chartKey = ''; //数据库key值

  //给备注加事件
  //// 屏蔽右键方便备注
  angular.element(document).bind('contextmenu', function() {
    return false;
  });
  angular.element("#RemarkDiv0").unbind("click").click(function(e) {
    e.stopPropagation();
  });
  angular.element(".close-div").unbind("click").click(function() {
    clearDiv();
  });
  angular.element(".btn-done").unbind("click").click(function() {
    remarkBlur();
  });
  angular.element("#remarkInput").bind("keyPress",function(event) {
    
    if (event.keyCode === 13) {
      angular.element(".btn-done").click();
    }
  });

  return {

    /**
     * 根据图表实例添加备注
     * @method chartAddRemrk
     * @param 根据图表实例添加备注
     * @return
     * author lfli
     * date 2015/8/13
     */
    chartAddRemark: chartAddRemark
      //singleClick: singleClick //单击事件回调
  };
  /**
   * [chartAddRemark 图标添加备注功能]
   * @param  {[type]} myChart  [实例名]
   * @param  {[type]} divId    [div的id]
   * @param  {[type]} chartKey [图表唯一key保存后台]
   * @return {[type]}          [description]
   */
  function chartAddRemark(myChart, divId, sKey) {
    chartKey = sKey;
    chartReark = myChart;
    angular.element('#' + divId).bind('mousedown', ShowMouse);
    //给图表添加事件移动上去事件
    myChart.on(echarts.config.EVENT.HOVER, function(param) {
      aRemarkParam = excludeVal(param.name) ? '' : param;
    });
    //移动到阴影部分事件
    myChart.on(echarts.config.EVENT.TOOLTIP_HOVER, getRemarkTooltip);
  }
  /**
   * 清空备注文本
   * @return {[type]}
   */
  function clearDiv() {
    angular.element('#remarkInput').val('');
    angular.element('#RemarkDiv0').hide();
    angular.element('#RemarkDiv0').css({
      'left': '0px',
      'top': '0px'
    });
  }

  /**
   * @return {[type]}
   */
  function remarkBlur() {
    var aRemark = aRemarkCharts;
    addPointLine(aRemark.keyValue, aRemark.keyName);
    angular.element('#RemarkDiv0').hide();
  }

  /**
   * 鼠标移动图表阴影部分事件
   * @method getRemarkTooltip
   * @param  param 图表默认返回的值 mychart 图表实例
   * @return RemarkParam
   * author lfli
   * date 2015/1/15
   */
  function getRemarkTooltip(param, mychart) {
    var index = param.dataIndex;
    var data = param.data;
    var xData = mychart.component.xAxis.option.xAxis[0].data;
    var name = mychart.component.xAxis.option.series[0].name;
    //备注名字  用于解决多个图表相似的Name
    var remarkName = mychart.getSeries()[0].remarkName;
    var timelineData = '';
    if (undefined !== mychart._timeline) {
      timelineData = mychart._timeline.myChart.component.timeline._chainPoint[mychart._timeline.currentIndex].name;
    }
    //自定义对象
    aRemarkParam = {
      dataIndex: index,
      event: param.event,
      name: xData[index],
      value: 0,
      seriesName: name,
      data: data,
      timelineData: timelineData,
      remarkName: remarkName
    };
  }
  /**
   * 显示备注文本框
   * @method showDiv
   * @param
   * @return
   * author lfli
   * date 2015/1/15
   */
  function showDiv(oRemark) {
    var bRemark = angular.element('#RemarkDiv0').is(':hidden');
    if (bRemark) {
      var e1 = oRemark.e || window.event;
      var myOffset = {};
      myOffset.left = e1.pageX;
      myOffset.top = e1.pageY;

      //当前视口的宽度
      var documentWidth = angular.element(document).width();
      //备注DIV的宽度
      var markWidth = angular.element('.mark-panel').width();

      var diffWidth = documentWidth - markWidth;

      if (myOffset.left > diffWidth) {
        myOffset.left = diffWidth - 80;
      }

      //还原div坐标位置
      angular.element('#RemarkDiv0').css({
        'left': '0px',
        'top': '0px'
      });
      angular.element('.txt-mark').text('X轴:' + oRemark.xValue);
      //设置div坐标位置
      angular.element('#RemarkDiv0').offset(myOffset);
      angular.element('#RemarkDiv0').find('#x').val(oRemark.xValue);
      angular.element('#RemarkDiv0').find('#remarkInput').val(oRemark.remarkInput);
      angular.element('#RemarkDiv0').find('#y').val(oRemark.yValue);
      angular.element('#RemarkDiv0').find('#titleName').val(oRemark.charName);
      angular.element('#RemarkDiv0').find('#seriesName').val(oRemark.seriesName);
      angular.element('#RemarkDiv0').find('#timelineData').val(oRemark.timelineData);
      angular.element('#RemarkDiv0').show();
    }

  }
  /**
   * [updateLegendPoint 更新备注-只针对图例点击]
   * @param  {[type]} remark      [当前图表备注对象]
   * @param  {[type]} mychart     [图表实例]
   * @param  {[type]} legendCount [总的legend]
   * @param  {[type]} index       [显示的索引]
   * @return {[type]}             [description]
   */
  function updateLegendPoint(remark, mychart, legendCount, index) {
    var Markpoint;
    if (undefined !== remark) {
      for (var i = 0; i < remark.length; i++) {
        var maxY = mychart.component.yAxis._axisList[0]._max;
        Markpoint = getMarkPoint(remark[i].point.xAxis, maxY, remark[i].point.value);
        //循环删除所有的点
        for (var j = 0; j < legendCount; j++) {
          mychart.delMarkPoint(j, remark[i].point.xAxis);
        }
        mychart.addMarkPoint(index, Markpoint);
      }
    }
  }
  /**
   * 修改标注点-更新 每次推送过来删除原先的点加上最新的点
   * @method updatePoint
   * @param{remark, mychart｝
   * @return
   * author lfli
   * date 2015/1/15
   */
  function updatePoint(remark, mychart) {
    var Markpoint;
    if (undefined !== remark) {
      for (var i = 0; i < remark.length; i++) {
        var markingstart = remark[i].markingStart;
        var maxY = mychart.component.yAxis._axisList[0]._max;
        Markpoint = getMarkPoint(remark[i].point.xAxis, maxY, remark[i].point.value);
        //获取MarkLine
        /*markLine = window.MarkLine(x, markingstart.xAxis, markingstart.yAxis, maxY);
        gTransAmountChart.delMarkLine(0, '交易量' + x + ' > 交易量' + x);
        gTransAmountChart.addMarkLine(0, markLine);*/
        mychart.delMarkPoint(0, markingstart.xAxis);
        mychart.addMarkPoint(0, Markpoint);
      }
    }
  }

  /**
   * 查询图表备注
   * @method queryRemark
   * @param 根据ID名 查备注
   * @return
   * author lfli
   * date 2015/1/15
   */
  function queryRemark(params, callback) {
    Restangular.all('visualization/operation/common/queryRemark').post(params).then(callback);
  }

  /**
   * 添加备注点和线
   * @method addPointLine
   * @param mychart module  模块名
   * @return
   * author lfli
   * date 2015/1/15
   */
  function addPointLine(mychart, module) {
    var remarkInput = angular.element('#RemarkDiv0').find('#remarkInput').val();
    //判断备注文本框是否输入值
    if (remarkInput.length > 0) {
      var x = angular.element('#RemarkDiv0').find('#x').val();
      //时间轴
      var timelineData = angular.element('#RemarkDiv0').find('#timelineData').val();
      //获取最大值
      var maxY = mychart.component.yAxis._axisList[0]._max;
      // var markLine = getMarkLine(xAxis, x, y, maxY);
      var Markpoint = getMarkPoint(x, maxY, ('备注:' + remarkInput));
      if (undefined !== mychart.component.legend) {
        var selectedDate = mychart.component.legend._selectedMap;
        var legendData = mychart.getOption().legend.data;
        var legendCount = mychart.getOption().legend.data.length;
        for (var i = 0; i < legendCount; i++) {
          mychart.delMarkPoint(i, x);
          if (selectedDate[legendData[i]]) {
            //添加删除Point
            mychart.addMarkPoint(i, Markpoint);
            break;
          }
        }
      } else {
        //添加删除Point
        mychart.delMarkPoint(0, x);
        mychart.addMarkPoint(0, Markpoint);
      }
      //保存提示值
      Markpoint.data[0].value = '备注:' + remarkInput;
      //拼接对象
      var point = {
        name: Markpoint.data[0].name,
        value: Markpoint.data[0].value,
        xAxis: Markpoint.data[0].xAxis,
        yAxis: Markpoint.data[0].yAxis
      };

      //拼接后台对象
      var _date = {
        module: module,
        xDate: timelineData !== '' ? timelineData : x,
        point: point
      };
      _date = JSON.stringify(_date);
      //保存到后台数据库
      Restangular.all('reactLead/common/updateOrSave').post(_date).then(function(param){
        console.log(param);
      });
      angular.element('#RemarkDiv0').find('#remarkInput').val('');

    } else {
      angular.element('#RemarkDiv0').hide();
      angular.element('#RemarkDiv0').css({
        'left': '0px',
        'top': '0px'
      });
    }
  }
  /**
   * 获取原先备注的文字
   * @method getRemarkInput
   * @return object
   * author llf
   * date 2015/8/3
   */
  function getRemarkInput(myChart, xValue) {
    var seriesDate = myChart.getSeries();
    for (var i = 0; i < seriesDate.length; i++) {
      if (undefined !== seriesDate[i].markPoint) {
        var pointData = seriesDate[i].markPoint.data;
        for (var p = 0; p < pointData.length; p++) {
          if (xValue === pointData[p].xAxis && '当前' !== pointData[p].name) {
            return pointData[p].unit.substring(3);
          }
        }
      }
    }
  }
  /**
   * [excludeVal 判断点击事件是否点击到了柱子上]
   * @param  {[type]} val [description]
   * @return {[type]}     [description]
   */
  function excludeVal(val) {
    if (('平均值' + '最大值' + '最小值' + '当前').indexOf(val) >= 0) {
      return true;
    }
  }


  //鼠标右击事件
  function ShowMouse(e) {
    //取出放在里面的Param
    if (aRemarkParam !== '') {
      //(e.which 3 = 鼠标右键   --1 =鼠标左键 2 = 鼠标中键;留给后续扩展
      switch (e.which) {
        case 3:
          //拼接备注对象
          var oRemark = {};
          oRemark.e = aRemarkParam.event; //坐标
          oRemark.xValue = aRemarkParam.name; //name就是点击x轴的值
          oRemark.yValue = aRemarkParam.value; //就是点击Y轴的值
          oRemark.seriesName = aRemarkParam.seriesName; //seriesName值
          oRemark.charName = chartKey; //保存后台数据库的名字(唯一)
          oRemark.remarkInput = getRemarkInput(chartReark, oRemark.xValue);
          //点击事件，会生成Div
          showDiv(oRemark);
          aRemarkCharts.keyName = oRemark.charName;
          aRemarkCharts.keyValue = chartReark;
          break;
      }
      aRemarkParam = '';
    }
  }

  /**
   * 获取备注MarkPoint对象
   * @method getMarkPoint
   * @param  xAxis x值, yAxis Y轴最大值, sValue  备注内容
   * @return MarkPoint对象集合
   * author lfli
   * date 2015/3/16
   */
  function getMarkPoint(xAxis, yAxis, sValue) {
    var point = [];
    var dataPoint = {
      name: xAxis,
      value: '',
      xAxis: xAxis,
      yAxis: yAxis,
      symbol: 'emptyCircle',
      symbolSize: 6,
      unit: sValue,
      tooltip: {
        trigger: 'item',
        formatter: function(v) {
          return v.data.unit;
        }
      }
    };
    dataPoint.itemStyle = {
      normal: {
        color: 'red',
        label: {
          show: false,
          formatter: ''
        }
      }
    };
    point.push(dataPoint);
    var markPoint = {};
    markPoint.data = point;
    return markPoint;
  }



}