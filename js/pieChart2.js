var width = 500;
var height = 350;


var pieSvg = d3.select("#piechartContainer2")
  .append('svg')
  .attr('width', width)
  .attr('height', height)

var pieGContainer = pieSvg.append('g')
  .attr('transform', 'translate(250, 300)')

// var quarterArc = d3.arc()
//   .innerRadius(80)
//   .outerRadius(130)
//   .startAngle(- 90 * Math.PI / 180)
//   .endAngle(0)

// var piePath = pieGContainer.append('path')
//   .attr('d', quarterArc)
//   .style('fill', 'pink')

/*
 * 画一层圆柱弧形
 */


var bowsData = d3.range(10)  // 10个数据

// 圆柱图比例尺
// 将半个圆平分成10块
var radialScaleBand = d3.scaleBand()
  .domain(d3.range(10))
  .range([-0.5 * Math.PI, 0.5 * Math.PI])

// 圆弧生成器方法一 起始角度算好的
var arcGenerator = d3.arc()
  .startAngle(d => radialScaleBand(d))
  .endAngle(d => radialScaleBand(d) + radialScaleBand.bandwidth())
  .padAngle(0.01)  // 圆弧之间的间距
  .innerRadius(100)
  .outerRadius(130)

// console.log('arcGenerator:', arcGenerator)

// 圆弧生成器方法二 起始角度固定的，偏移计算在g元素上
var arcGenerator2 = d3.arc()
  .startAngle(Math.PI / -20)  // 整个圆下来平分了 10 * 2 份
  .endAngle(Math.PI / 20)
  .padAngle(0.01)  // 圆弧之间的间距
  .innerRadius(100)
  .outerRadius(130)

/*
 * 开始画圆了
 */

// 方法一
// pieGContainer.selectAll('g')
//   .data(bowsData)
//   .enter()
//   .append('g')
//   .append('path')
//   .attr('d', arcGenerator)
//   .style('fill', 'pink')

// 方法二
pieGContainer.selectAll('g')
  .data(bowsData)
  .enter()
  .append('g')  // 有10个g元素
  .attr('transform', d => 'rotate(' + (radialScaleBand(d) + radialScaleBand.bandwidth() / 2) * (180 / Math.PI) + ')')
  .append('path')
  .attr('d', arcGenerator2)
  .style('fill', 'pink')

