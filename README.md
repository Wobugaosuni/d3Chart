## 我制作的图表效果
  https://wobugaosuni.github.io/d3Chart/

<br />

## d3.js
  - 图表的制作引入了d3.js的函数库

<br />

## clone or download代码
  - 点击右上角绿色图标

<br />

## 在浏览器中打开index.html
  注意，由于存在异步的请求，需要使用本地服务器打开
  <br />
  有两种工具推荐：
  - **http-server** <br />
  [http-server](https://github.com/indexzero/http-server)
  ```bash
  ## 全局安装http-server
  npm install -g http-server
  ## 查看所有命令
  http-server --help
  ## 在项目根目录下执行
  http-server .
  ```

  - **browserSync** <br />
  浏览器同步工具：[browserSync](http://www.browsersync.cn/)
  ```bash
  ## 全局安装browserSync
  npm install -g browser-sync
  ## 查看所有命令
  browser-sync
  ## 在项目根目录下执行
  browser-sync start --server --files ".index.html"
  ```
