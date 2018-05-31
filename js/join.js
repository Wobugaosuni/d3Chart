var svgContainer = d3.select('#piechartContainer3')
  .append('svg')
  .attr('class', 'svg-container')
  .attr('width', '500px')
  .attr('height', '300px')

var gContainer = svgContainer.append('g')
  .attr('class', 'g-container')
  .attr('transform', 'translate(20, 100)')


var list = 'abcdefghijklmnopqrstuvwxyz'.split('')

function update(data) {
  console.log('data:', data)

  var textContainers = gContainer.selectAll('text')
  /** 数据绑定 */
    .data(data)

  // console.log('textContainers:', textContainers)

  /** update */
  textContainers
    .attr('class', 'update')
    .attr('fill', '#fff')

  /** enter */
  /** 当存在未被绑定元素的数据时，创建新的元素 */
  textContainers.enter()
    .append('text')
    .attr('class', 'enter')
    .attr('fill', 'pink')
    .attr('x', (d, i) => i * 10)
    .attr('y', 0)
    .merge(textContainers)  /** 合并绑定的数据集 */
    .text(d => d)


  /** exit */
  /** 删除未绑定数据的元素 */
  textContainers.exit().remove()

  console.log('textContainers1:', textContainers)

}

/** 初始化 render */
update(list)

d3.interval(function() {
  var newList = d3.shuffle(list)  /** 重新洗牌，换位置 */
    .slice(0, Math.floor(Math.random() * 27))  /** 随机截取数组一段的元素 */
    .sort()  /** 排序 */

  update(newList)
}, 3000)
