var width = 960,
  height = 500,
  margin = { top: 40, bottom: 40, left: 140, right: 140 },
  scalepop = d3.scaleSqrt().domain([0, 100000]).range([0.2, 34]),
  scalecountry = d3.scaleOrdinal(d3.schemeCategory20b),
  centerx = d3.scaleLinear()
    .range([margin.left, width - margin.right]),
  centery = d3.scaleLinear()
    .range([margin.top, height - margin.bottom]);

d3.csv('../cities.csv', function (cities) {

  const data = cities
    .sort((a, b) => d3.descending(+a[2015], +b[2015]))
    .map((d, i) => {
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
  const svg = d3.select("#thumbnail").append("svg")
    .attr("width", width)
    .attr("height", height);


  // pos is the array of positions that will be updated by the tsne worker
  // start with the geographic coordinates as is (plate-carrée)
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
    .defer(d3.text, 'tsne.js')
    .defer(d3.text, 'https://unpkg.com/d3-geo')
    .defer(d3.text, 'worker.js')
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
