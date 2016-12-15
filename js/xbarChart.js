var data = [1, 4, 7, 2, 9, 13, 5, 8, 2, 9],
		barHeight = 20,
		barPadding = 5,
		svgWidth = 500,
		svgHeight = (barHeight + barPadding) * data.length;

var barSvg = d3.select("#xbarchartContainer")
							 .append("svg")
							 .attr("width", svgWidth)
							 .attr("height", svgHeight);

var barG = barSvg.selectAll("g")
			.data(data)
			.enter()
			.append("g")
			.attr("transform", function(d, i, item){
				return "translate(0," + (barHeight+barPadding) * i + ")";
			});

// 定义X轴的缩放函数
var scaleX = d3.scaleLinear()
							.domain([0, d3.max(data)])
							.range([0, svgWidth-25])

barG.append("rect")
		.attr("width", function (d) {return scaleX(d);})
		.attr("height", barHeight)
		.style("fill", "steelblue")

barG.append("text")
		.text(function (d) {return d;})
		.attr("x", function (d) {return scaleX(d);})  // text文本在X轴的坐标
		.attr("y", barHeight-5)  // text文本在Y轴的坐标
		.attr("text-anchor", "end")
		.style("stroke", "purple")
		
