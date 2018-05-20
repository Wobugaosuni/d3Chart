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


/*
 * 定义渐变色
 */
var defsContainer = pieGContainer.append('defs')
  .append('linearGradient')
  .attr('id', 'defsLinearGradient')

defsContainer.append('stop')
  .attr('offset', '5%')
  .attr('stop-color', '#004CAA')
defsContainer.append('stop')
  .attr('offset', '95%')
  .attr('stop-color', '#00ABB8')


// 二维数据
var bowsData = d3.range(10)
  .map((rangeItem, rangeIndex) => {
    var data = d3.range(15).map((item, index) => {
      return {
        value: Math.random() * 10,
        base: rangeIndex,
        index: index,
      }
    })


    return {
      index: rangeIndex,
      data: data
    }
  })

console.log('bowsData:', bowsData)

// 圆柱体比例尺
var radialScaleBand = d3.scaleBand()
  .domain(d3.range(10))
  .range([-0.5 * Math.PI, 0.5 * Math.PI])

// 圆弧生成器方法一 起始角度算好的
var arcGenerator = d3.arc()
  .startAngle(d => radialScaleBand(d.base))
  .endAngle(d => radialScaleBand(d.base) + radialScaleBand.bandwidth())
  .padAngle(0.01)
  // 统一大小
  // .innerRadius((item, index) => 13 * index + 3)
  // 数据mock，随机
  .innerRadius((item, index) => {
    var innerNumber = 13 * index + 30 + (13 - item.value * 13 / 10)
    // console.log('innerNumber:', innerNumber)
    return innerNumber
  })
  .outerRadius((item, index) => 13 * index + 40)

// console.log('arcGenerator2:', arcGenerator)

var bowContainers = pieGContainer.selectAll('g')
  .data(bowsData)
  .enter()
  .append('g')

bowContainers.selectAll('path')
  .data(item => item.data)
  .enter()
  .append('path')
  .attr('d', arcGenerator)
  .style('fill', 'url(#defsLinearGradient)')
