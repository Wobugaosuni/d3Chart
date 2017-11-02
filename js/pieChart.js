d3.csv("../data2.csv", type, function (data) {
	// console.log(data)

	var width = 500,
			height = 350;

	var pieSvg = d3.select("#piechartContainer")
								 .append("svg")
								 .attr("width", width)
								 .attr("height", height)

	var pieGContainer = pieSvg.append("g")
														.attr("transform", "translate(250,170)")  // 偏移点为弧的圆心！！！

	// 画弧函数
	var arcGenerator = d3.arc()
											 .innerRadius(0)
											 .outerRadius(130)
											 // .startAngle(0)
											 // .endAngle(120 * Math.PI/180)

	// 计算起始和结束角度
	var angleData = d3.pie()
										.value(function (data) {return data.population;})
	// console.log(angleData(data))	// [{data: {}, endAngle: ..., index: 3, padAngle: 0, startAngle: ..., value: 11964}, {...}, ...]

	// 使用d3定义好的颜色函数，给扇形填充颜色
	// var color = d3.scaleOrdinal(d3.schemeCategory10);

	// 使用自定义的颜色
	var color = ['#AED4C2', '#DDA490', '#8DB9BE', '#6A7984', '#D06E6B']
	// console.log(color)

	var piePath = pieGContainer.selectAll("path")
														 .data(angleData(data))
														 .enter()
														 .append("path")
														 .attr("d", arcGenerator)
														 .style("fill", function (d, i) {return color[i];})  // 取前五种颜色，为每个扇形添加颜色
														 .on('mouseover', (d, i) => {
															d3.select(d3.event.target)
																.transition()
																.duration(1000)
																.ease(d3.easeCubicOut)
																.attr('transform', d => `translate(${arcGenerator.centroid(d)})`)
														 })
														 .on('mouseout', (d, i) => {
															d3.select(d3.event.target)
																.transition()
																.duration(500)
																.attr('transform', d => `translate(${[0,0]})`)
														 })

	// 给扇形添加文字，通过扇形的中心位置进行定位
	var pieText = pieGContainer.selectAll("text")
														 .data(angleData(data))
														 .enter()
														 .append("text")
														 .text(function (angleData) {return angleData.data.education})  // 因为绑定了angleData的数据
														 .attr("transform", function (angleData) {return "translate(" + arcGenerator.centroid(angleData) + ")";})  // 根据中心点的位置进行偏移
														 .attr("text-anchor", "middle")  // 让文字中心对齐
														 .attr("font-size", "12px")
})

function type(data) {
	data.population = +data.population;
	return data;
}
