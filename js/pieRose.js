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

var scaleBand = d3.scaleBand()
  .domain(config.series.map(item => item.value))
  .range([110, 90])

// console.log(config.series.map(item => item.value).sort((a, b) => a - b));

var arcGenerator = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(item => {
    var number = scaleBand(item.data.value)
    console.log('number:', number);
    return number
  })
  .startAngle(item => item.startAngle)
  .endAngle(item => item.endAngle)

var angleData = d3.pie()
  // .value(item => item.value)
  .value(item => 1)  // 均分

// console.log('angleData:', JSON.stringify(angleData(config.series)))


var bowContainers = pieGContainer.selectAll('g')
  .data(angleData(config.series))
  .enter()
  .append('g')

bowContainers.append('path')
  .attr('d', arcGenerator)
  .attr('fill', (item, index) => config.colors[index])
