// api文档参考：https://github.com/d3/d3/blob/master/API.md

/*
  // 相关api
  // 比例尺
  - d3.scaleSqrt().domain([0, 100000]).range([0.2, 34])：平方根比例尺
  - d3.scaleLinear()：线性比例尺
  - d3.scaleOrdinal(d3.schemeCategory20b)：序数颜色比例尺，输入域和输出域都使用离散的数据，20种颜色

  // 数据处理
  - d3.descending()：降序函数
  - .force()：布局(数据转换)，将数据转换为力图需要的数据
*/

/**
 * 1. 初始化配置
 */
var width = 960,
  height = 500,
  margin = { top: 40, bottom: 40, left: 140, right: 140 },
  /* `domain()`是输入域，`range()`是输出域，相当于将`domain`中的数据集映射到`range`的数据集中 */
  scalepop = d3.scaleSqrt().domain([0, 100000]).range([0.2, 34]),
  /**
   * 定义一个序数颜色比例尺
   */
  /* d3.scaleOrdinal() 序数比例尺，输入域和输出域都使用离散的数据 */
  /* d3.schemeCategory20b 20种颜色 */
  scalecountry = d3.scaleOrdinal(d3.schemeCategory20b),
  centerx = d3.scaleLinear()
    .range([margin.left, width - margin.right]),
  centery = d3.scaleLinear()
    .range([margin.top, height - margin.bottom]);

/**
 * ds.csv() 读取csv数据文件，并把数据转换为数组
 * @param csv数据文件路径
 * @param 回调函数，参数是csv文件数据转换后的数组
 */
d3.csv('../cities.csv', function (cities) {

/**
 * 2. 对返回的原始数据进行整理
 */
  const data = cities
    .sort((a, b) => {
/**
 * d3.descending() 降序函数
 * @param a 比较值1
 * @param b 比较值2
 */
      return d3.descending(+a[2015], +b[2015])
    })
    .map((d, i) => {
      // console.log('d:', d);
      return {
        lon: +d.Longitude,
        lat: +d.Latitude,
        name: d['Urban Agglomeration'],
        r: scalepop(+d[2015]),
        color: scalecountry(+d['Country Code'])
      };
    })
    .slice(0, 800);

  /*
  const canvas = d3.select("body").append("canvas")
      .attr("width", width)
      .attr("height", height);
  */
  /**
   * 3. 选择图表容器，插入svg元素
   */
  const svg = d3.select("#thumbnail").append("svg")
    .attr("width", width)
    .attr("height", height);

  /**
   * 4. 创建力模拟
   */

  // pos is the array of positions that will be updated by the tsne worker
  // start with the geographic coordinates(坐标) as is (plate-carrée)
  // random or [0,0] is fine too
  let pos = data.map(d => [d.lon, -d.lat]);


  const forcetsne = d3.forceSimulation(
    data.map(d => (d.x = width / 2, d.y = height / 2, d))
  )
    .alphaDecay(0.005)
    .alpha(0.1)
    .force('tsne', function (alpha) {

      centerx.domain(d3.extent(pos.map(d => d[0])));
      centery.domain(d3.extent(pos.map(d => d[1])));

      data.forEach((d, i) => {
        d.x += alpha * (centerx(pos[i][0]) - d.x);
        d.y += alpha * (centery(pos[i][1]) - d.y);
      });
    })
    .force('collide', d3.forceCollide().radius(d => 1.5 + d.r))
    .on('tick', function () {

      // drawcanvas(canvas, data);
      drawsvg(svg, data);

    });

  function drawcanvas(canvas, nodes) {
    let context = canvas.node().getContext("2d");
    context.clearRect(0, 0, width, width);

    for (var i = 0, n = nodes.length; i < n; ++i) {
      var node = nodes[i];
      context.beginPath();
      context.moveTo(node.x, node.y);
      context.arc(node.x, node.y, node.r, 0, 2 * Math.PI);
      context.lineWidth = 0.5;
      context.fillStyle = node.color;
      context.fill();
    }
  }

  function drawsvg(svg, nodes) {
    const g = svg.selectAll('g.city')
      .data(nodes);

    var enter = g.enter().append('g').classed('city', true);

    enter.append('circle')
      .attr('r', d => d.r)
      .attr('fill', d => d.color)
      .append('title')
      .text(d => d.name);

    enter
      .filter(d => d.r > 7)
      .append('text')
      .attr('fill', 'white')
      .style('font-size', d => d.r > 9 ? '12px' : '9px')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('pointer-events', 'none')
      .text(d => d.name.substring(0, 2));

    g.attr('transform', d => `translate(${d.x},${d.y})`);

  }


  d3.queue()
    .defer(d3.text, '../util/tsne.js')
    .defer(d3.text, 'https://unpkg.com/d3-geo')
    .defer(d3.text, '../util/worker.js')
    .awaitAll(function (err, scripts) {

      const worker = new Worker(
        window.URL.createObjectURL(
          new Blob(scripts, {
            type: "text/javascript"
          })
        )
      );

      worker.postMessage({
        maxIter: 10,
        dim: 2,
        perplexity: 30.0,
        data: data
      });

      worker.onmessage = function (e) {
        if (e.data.log) console.log.apply(this, e.data.log);
        if (e.data.pos) pos = e.data.pos;
        if (e.data.done && e.data.done < 10000 && e.data.cost > 1e-2) {
          worker.postMessage({
            maxIter: e.data.done + 10,
          });
        }
      };
    });

});


// 文档参考
// http://sevenchan07.com/d3-common-scale/
