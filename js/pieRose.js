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

var width = 500

var height = 350

var pieSvg = d3.select('#piechartContainer4')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

var pieGContainer = pieSvg.append('g')
  .attr('transform', 'translate(' +  width / 2 + ',' + height / 2 + ')')

var innerRadius = 20

var scaleBandPie = d3.scaleBand()
  .domain(config.series.map(item => item.value))
  .range([110, 90])
var scaleBandDash = d3.scaleBand()
  .domain(d3.range(50))
  .range([0, Math.PI * 2])

// console.log(config.series.map(item => item.value).sort((a, b) => a - b));

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

var angleData = d3.pie()
  // .value(item => item.value)
  .value(item => 1)  // 均分

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
    var points = [
      middleArc.centroid(item),
      outerArc.centroid(item)
    ]
    // console.log('item:', item);
    console.log('points:', points);

    return points
  })
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
