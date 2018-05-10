// 1. 初始数据
var nodes = [{ name: "桂林" }, { name: "广州" },
{ name: "厦门" }, { name: "杭州" },
{ name: "上海" }, { name: "青岛" },
{ name: "天津" }];

var edges = [{ source: 0, target: 1 }, { source: 0, target: 2 },
{ source: 0, target: 3 }, { source: 1, target: 4 },
{ source: 1, target: 5 }, { source: 1, target: 6 }];

// 2. 布局(数据转换)
var force = d3.forceSimulation(nodes)
// .force("link", d3.forceLink().id(function (d) {
  //   /***
  //     指定连线的连接所使用的标示是哪一个字段。
  //   ***/
  //   return d.index
  // }))
  .force("link", d3.forceLink(edges))
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter())

  // ** v3版本 **
  // .nodes(nodes)  // 指定节点数组
  // .links(edges)  // 指定连线数组
  // .size([width, height])  // 指定作用域范围
  // .distance(150)  // 指定连线长度
  // .charge([-400])  // 相互之间的作用力

// force.start()

console.log('nodes:', nodes);
console.log('edges:', edges);

