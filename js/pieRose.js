var config = {
  colors: [
    '#028A72',
    '#03AB60',
    '#00bb76',
    '#a2dd38',
    '#bbe12d',
  ],
  series: [
    {
      name: '磨合期',
      value: 27.3,
    },
    {
      name: '准业主1',
      value: 25.55,
    },
    {
      name: '准业主2',
      value: 19.2,
    },
    {
      name: '老业主',
      value: 15.45,
    },
    {
      name: '稳定期',
      value: 12.5,
    },
  ]
}

// 处理数据，数据降序处理
config.series = config.series.sort((a, b) => b.value - a.value)

/**
 * 常量定义模块
 */
var width = 500
var height = 350
var maxRadius = 110
var innerRadius = 20


/**
 * 比例尺定义模块
 */
var scaleBandPie = d3.scaleBand()
  .domain(config.series.map(item => item.value))
  .range([maxRadius, 90])

var scaleBandDash = d3.scaleBand()
  .domain(d3.range(50))
  .range([0, Math.PI * 2])

var polyfillThirdX = d3.scaleLinear()
  .domain([1, 80])
  .range([120, 50])


/**
 * d3.arc()弧生成器的各种定义模块
 */
var pieArcGenerator = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(item => {
    var number = scaleBandPie(item.data.value)
    // console.log('number:', number);
    return number
  })
  .startAngle(item => item.startAngle)
  .endAngle(item => item.endAngle)

var dashArcGenerator = d3.arc()
  .innerRadius(60 - 0.5)
  .outerRadius(60 + 0.5)
  .startAngle(item => scaleBandDash(item))
  .endAngle(item => scaleBandDash(item) + scaleBandDash.bandwidth())
  .padAngle(0.02)

var middleArc = d3.arc()
  .innerRadius(60)
  .outerRadius(60)

var outerArc = d3.arc()
  .innerRadius((item => {
    return scaleBandPie(item.data.value)
  }))
  .outerRadius((item => {
    return scaleBandPie(item.data.value)
  }))

/**
 * d3.pie()布局的定义模块
 */
var angleData = d3.pie()
  // .value(item => item.value)
  .value(item => 1)  // 均分


/**
 * 实操模块
 */
// 基础部分布局
var pieSvg = d3.select('#piechartContainer4')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

var pieGContainer = pieSvg.append('g')
  .attr('transform', `translate(${width / 2}, ${height / 2})`)

var bowContainers = pieGContainer.selectAll('g')
  .data(angleData(config.series))
  .enter()
  .append('g')

/**
 * pie图
 */
bowContainers.append('path')
  .attr('d', pieArcGenerator)
  .attr('fill', (item, index) => config.colors[index])

/**
 * polyline
 */
bowContainers.append('polyline')
  .attr('points', item => {
    var thirdPoint = outerArc.centroid(item)
    // x固定
    thirdPoint[0] = thirdPoint[0] > 0 ? maxRadius * 1.2 : - maxRadius * 1.2
    // x随机
    // thirdPoint[0] = thirdPoint[0] > 0 ? thirdPoint[0] + polyfillThirdX(thirdPoint[0]) : thirdPoint[0] - polyfillThirdX(-thirdPoint[0])
    // console.log('thirdPoint:', thirdPoint)

    var points = [
      middleArc.centroid(item),
      outerArc.centroid(item),
      thirdPoint
    ]
    // console.log('item:', item);
    console.log('points:', points);

    return points
  })
  .attr('fill', 'none')
  .attr('stroke', '#fff')
  .attr('stroke-dasharray', '5,1')

/**
 * 虚线部分，相当于一维多柱图的制作方法
 */
bowContainers.append('g')
  .selectAll('path')
  .data(d3.range(50))
  .enter()
  .append('path')
  .attr('d', dashArcGenerator)
  .attr('fill', '#fff')

// bowContainers.append('path')
//   .attr('d', d3.arc()
//     .innerRadius(60 - 0.5)
//     .outerRadius(60 + 0.5)
//     .startAngle(0)
//     .endAngle(2 * Math.PI)
//   )
//   .attr('fill', 'none')
//   .attr('stroke', '#fff')
//   .attr('stroke-dasharray', '5,1')

/**
 * 文字部分
 */
// 第一行
bowContainers.append('text')
  .text(item => item.data.name)
  .attr('transform', item => {
    var thirdPoint = outerArc.centroid(item)
    // x固定
    thirdPoint[0] = thirdPoint[0] > 0 ? maxRadius * 1.25 : - maxRadius * 1.25

    return `translate(${thirdPoint})`
  })
  .attr('fill', '#fff')
  .attr('font-size', '13px')
  .attr('text-anchor', item => {
    var thirdPoint = outerArc.centroid(item)
    return thirdPoint[0] > 0 ? 'start' : 'end'
  })

// 第二行
bowContainers.append('text')
  .text(item => '30%')
  .attr('transform', item => {
    var thirdPoint = outerArc.centroid(item)
    // x固定
    thirdPoint[0] = thirdPoint[0] > 0 ? maxRadius * 1.25 : - maxRadius * 1.25
    thirdPoint[1] = thirdPoint[1] + 14

    return `translate(${thirdPoint})`
  })
  .attr('fill', '#fff')
  .attr('font-size', '12px')
  .attr('text-anchor', item => {
    var thirdPoint = outerArc.centroid(item)
    return thirdPoint[0] > 0 ? 'start' : 'end'
  })
