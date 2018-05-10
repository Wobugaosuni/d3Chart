var width = 500;
var height = 350;


var pieSvg = d3.select("#piechartContainer2")
  .append('svg')
  .attr('width', width)
  .attr('height', height)

var pieGContainer = pieSvg.append('g')
  .attr('transform', 'translate(250, 170)')

var quarterArc = d3.arc()
  .innerRadius(80)
  .outerRadius(130)
  .startAngle(- 90 * Math.PI / 180)
  .endAngle(0)

var piePath = pieGContainer.append('path')
  .attr('d', quarterArc)
  .style('fill', 'pink')

