// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'), 'macarons');

// 指定图表的配置项和数据
var option = {
  title: {
    text: "某地区蒸发量和降水量",
    subtext: "双Y轴 折线图柱状图混搭"
  },
  tooltip: {
    trigger: "axis"
  },
  legend: {
    data: ["蒸发量", "降水量", "蒸发量增量", "降水量增量"]
  },
  toolbox: {
    show: true,
    feature: {
      mark: {
        show: true
      },
      saveAsImage: {
        show: true
      }
    }
  },
  calculable: true,
  xAxis: [{
    type: "category",
    axisLine: {
      onZero: false
    },
    data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
  }],
  grid: {
    y: 70
  },
  yAxis: [{
    type: "value",
    name: "绝对值"
  }, {
    type: "value",
    name: "增量",
    min: -300,
    max: 150
  }],
  series: [{
    name: "蒸发量",
    type: "bar",
    data: [2, 4.9, 7, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20, 6.4, 3.3]
  }, {
    name: "降水量",
    type: "bar",
    data: [2.6, 5.9, 9, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6, 2.3]
  }, {
    name: "蒸发量增量",
    type: "line",
    yAxisIndex: 1,
    data: [0, 2.9, 2.1, 16.2, 2.4, 51.1, 58.9, 26.6, -129.6, -12.6, -13.6, -3.1]
  }, {
    name: "降水量增量",
    type: "line",
    yAxisIndex: 1,
    data: [0, 3.3, 3.5, 50, 2.3, 42, 104.9, 6.6, -133.5, -29.9, -12.8, -3.7]
  }]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);

var clone = function(obj) {
  var o;
  if (typeof obj == "object") {
    if (obj === null) {
      o = null;
    } else {
      if (obj instanceof Array) {
        o = [];
        for (var i = 0, len = obj.length; i < len; i++) {
          o.push(clone(obj[i]));
        }
      } else {
        o = {};
        for (var k in obj) {
          o[k] = clone(obj[k]);
        }
      }
    }
  } else {
    o = obj;
  }
  return o;
}

var convertToTable = function(opt) {
  var axisData = opt.xAxis[0].data;
  var series = opt.series;

  var arrayData = new Array();
  var array1 = new Array();

  array1.push("");

  for (var i = 0; i < series.length; i++) {
    array1.push(series[i].name);
  }

  arrayData.push(array1);

  for (var i = 0; i < axisData.length; i++) {

    var arrayn = new Array();
    arrayn.push(axisData[i]);

    for (var j = 0; j < series.length; j++) {
      arrayn.push(series[j].data[i]);
    }

    arrayData.push(arrayn);
  }

  return arrayData;
}

var convertToChart = function(arr, opt) {

  var arrLen1 = arr.length;
  var arrLen2 = arr[0].length;

  var axisData = new Array();
  var series = opt.series;

  for (var i = 0; i < arrLen1; i++) {
    axisData.push(arr[i][0]);
  }

  axisData.shift()
  axisData.pop();

  opt.xAxis[0].data = axisData;

  for (var i = 1; i < arrLen2; i++) {
    opt.legend.data[i-1] = arr[0][i];
    series[i-1].name = arr[0][i];
  }


  for (var i = 1; i < arrLen1; i++) {

    for (var j = 1; j < arrLen2; j++) {
      series[j-1].data[i-1] = arr[i][j];
    }

  }

  return opt;
}

var tableData = convertToTable(option);

var container = document.getElementById('example');

var hot = new Handsontable(container, {
  data: tableData,
  columns: option.series[0].data,
  minSpareCols: 1,
  minSpareRows: 1,
  rowHeaders: true,
  colHeaders: true,
  contextMenu: true,
  manualColumnResize: true,
  manualRowResize: true
});

hot.addHook('afterChange', function() {
  var newOption = clone(option);
  newOption = convertToChart(tableData, newOption);
  myChart.setOption(newOption);
});
