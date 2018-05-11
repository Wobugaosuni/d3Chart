/*
	相关接口
	- .arc()，弧生成器，d3.shape模块下的。https://github.com/d3/d3-shape#arcs
	- .pie()，布局(数据转换)，d3.layout模块下的。将数据转换成画饼图所需要的数据(起始角度，终止角度)
	- .centroid()，计算弧线的中心
*/

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

	/*
	 * .arc(): 画弧函数。
	 * 根据传入的参数值（innerRadius、outerRadius、startAngle、endAngle），创建一个生成器（generator）
	 * 生成并返回 path 元素中 d 属性绘制圆形所需要的值
	 * 这个值包含圆的起始、终止角度（顺时针方向），内外圆半径（用于决定是画圆还是画圆环）
	 */
	// 实现方法一，使用 d3.arc 内置的函数 使用 链式的方法依次设定这些属性值
	var arcGenerator = d3.arc()
											 .innerRadius(0)
											 .outerRadius(130)
											//  .startAngle(0)
											//  .endAngle(120 * Math.PI/180)

	// 实现方法二，直接传入若干属性值
	// var arcGenerator = d3.arc({
	// 	innerRadius: 0,
	// 	outerRadius: 130,
	// })

	// console.log('range1:', d3.range(0, 1, 1 / 49))
	// console.log('range2:', d3.range(49).map(item => item / 49))
	// d3.range(49).map(function(d) { return d / 49; })

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
								.attr("transform", function (angleData) {
								//  console.log('arcGenerator.centroid(angleData):', arcGenerator.centroid(angleData))
									return "translate(" + arcGenerator.centroid(angleData) + ")";
								})  // 根据中心点的位置进行偏移
								.attr("text-anchor", "middle")  // 让文字中心对齐
								.attr("font-size", "12px")
})

function type(data) {
	data.population = +data.population;
	return data;
}
