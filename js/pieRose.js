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
      name: '宏华监测',
      value: 57,
    },
    {
      name: '宏华待监测',
      value: 11,
    },
    {
      name: '其他厂商',
      value: 32,
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

var middleRadius = 60

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
    console.log('number:', number);
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
 * 虚线部分，相当于一维多柱图的制作方法
 */
bowContainers.append('g')
  .selectAll('path')
  .data(d3.range(50))
  .enter()
  .append('path')
  .attr('d', dashArcGenerator)
  .attr('fill', '#fff')
