/*
 * 多层圆弧
 */

var width = 500;
var height = 350;


var pieSvg = d3.select("#piechartContainer3")
  .append('svg')
  .attr('width', width)
  .attr('height', height)

var pieGContainer = pieSvg.append('g')
  .attr('transform', 'translate(250, 300)')

// 二维数据
var bowsData = d3.range(10)
  .map((item, index) => {
    var data = d3.range(25)
  })


