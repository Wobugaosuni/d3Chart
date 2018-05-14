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
  // 数据mock
  .innerRadius((item, index) => {
    var innerNumber = 13 * index + 3 + (13 - item.value * 13 / 10)
    // console.log('innerNumber:', innerNumber)
    return innerNumber
  })
  .outerRadius((item, index) => 13 * index + 13)

// console.log('arcGenerator2:', arcGenerator)

// 颜色升级
const a = d3.rgb(159, 249, 223)
const b = d3.rgb(85, 229, 208)
const c = d3.rgb(0, 169, 180)
const d = d3.rgb(0, 81, 165)
const e = d3.rgb(95, 31, 167)

const color = d3.interpolateRgbBasis([a, b, c, d, e])

const linear = d3.scaleLinear()
  .domain(d3.range(25))
  .range([0, 1])

var bowContainers = pieGContainer.selectAll('g')
  .data(bowsData)
  .enter()
  .append('g')

bowContainers.selectAll('path')
  .data(item => item.data)
  .enter()
  .append('path')
  .attr('d', arcGenerator)
  .style('fill', item => color(linear(item.index)))
