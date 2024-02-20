# 01_初识 Node.js 与内置模块
## fs 文件系统模块
fs 文件系统模块
	![](./assets/Pasted%20image%2020240110115008.png) 
读取指定文件中的内容
	![](./assets/Pasted%20image%2020240110120528.png) 
	![](./assets/Pasted%20image%2020240110120653.png) 
	![](./assets/Pasted%20image%2020240110120839.png) 
向指定的文件中写入内容
	![](./assets/Pasted%20image%2020240110122534.png) 
	![](./assets/Pasted%20image%2020240110122944.png) 

注意：
fs.writeFile() 方法只能用来创建文件，不能用来创建路径
重复调用 fs.writeFile() 写入同一个文件，新写入的内容会覆盖之前的旧内容

路径动态拼接的问题
	在使用 fs 模块操作文件时，如果提供的操作路径是以 ./ 或 ../ 开头的相对路径时，很容易出现路径动态拼接错误的问题。 
	原因：代码在运行的时候，会以执行 node 命令时所处的目录，动态拼接出被操作文件的完整路径。 
	解决方案：在使用 fs 模块操作文件时，直接提供完整的路径，不要提供 ./ 或 ../ 开头的相对路径，从而防止路径动态拼接的问题。
	`__dirname` 表示当前文件所处的目录
	![](./assets/Pasted%20image%2020240110134249.png) 
	**扩展**
	在Python中，相对路径是相对于当前工作目录（Current Working Directory，简称CWD）来解析的。具体来说：
	1. **执行时命令行所在目录**：当你直接在命令行中运行Python脚本时，Python解释器的工作目录是命令行所在的目录。
	2. **Python脚本所在目录**：当你在Python脚本中调用os模块的`os.getcwd()`方法时，它会返回Python脚本的目录，而不是执行时的命令行所在目录。

## path 路径模块
path 路径模块
	![](./assets/Pasted%20image%2020240110135010.png) 
path.join() 的代码示例
	![](./assets/Pasted%20image%2020240110135336.png) 
	注意：今后凡是涉及到路径拼接的操作，都要使用 path.join() 方法进行处理。不要直接使用 + 进行字符串的拼接
	**扩展**：python里应该也要注意
path.basename() 
	![](./assets/Pasted%20image%2020240110140341.png) 
使用 path.extname() 方法，可以获取路径中的扩展名部分


## http模块
http 模块是 Node.js 官方提供的、用来创建 web 服务器的模块。通过 http 模块提供的 http.createServer() 方法，就 能方便的把一台普通的电脑，变成一台 Web 服务器，从而对外提供 Web 资源服务。

### 创建最基本的 web 服务器
```js
// 1. 导入 http 模块
const http = require('http')
// 2. 创建 web 服务器实例
const server = http.createServer()
// 3. 为服务器实例绑定 request 事件，监听客户端的请求
server.on('request', function (req, res) {
  console.log('Someone visit our web server.')
})
// 4. 启动服务器
server.listen(8080, function () {  
  console.log('server running at http://127.0.0.1:8080')
})
```
##### req 请求对象 res 响应对象
```js
// req 是请求对象，包含了与客户端相关的数据和属性
server.on('request', (req, res) => {
  // req.url 是客户端请求的 URL 地址
  const url = req.url
  // req.method 是客户端请求的 method 类型
  const method = req.method
  const str = `Your request url is ${url}, and request method is ${method}`
  console.log(str)
  // 调用 res.end() 方法，向客户端响应一些内容
  res.end(str)
})
```
##### 解决中文乱码问题
```js
server.on('request', (req, res) => {
  // 定义一个字符串，包含中文的内容
  const str = `您请求的 URL 地址是 ${req.url}，请求的 method 类型为 ${req.method}`
  // 调用 res.setHeader() 方法，设置 Content-Type 响应头，解决中文乱码的问题
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  // res.end() 将内容响应给客户端
  res.end(str)
})
```

### 根据不同的 url 响应不同的 html 内容
```js
server.on('request', (req, res) => {
  // 1. 获取请求的 url 地址
  const url = req.url
  // 2. 设置默认的响应内容为 404 Not found
  let content = '<h1>404 Not found!</h1>'
  // 3. 判断用户请求的是否为 / 或 /index.html 首页
  // 4. 判断用户请求的是否为 /about.html 关于页面
  if (url === '/' || url === '/index.html') {
    content = '<h1>首页</h1>'
  } else if (url === '/about.html') {
    content = '<h1>关于页面</h1>'
  }
  // 5. 设置 Content-Type 响应头，防止中文乱码
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  // 6. 使用 res.end() 把内容响应给客户端
  res.end(content)
})
```
>`===`与`==`的区别，差点忘了：在JavaScript中，`===` 和 `==` 都是比较运算符，但它们在处理类型转换时有所不同。
>`===`（严格相等）会比较两个值的内容和类型。只有当两个值的内容和类型都相同时，它们才被认为是相等的。
>`==`（宽松相等）会比较两个值的内容，并且在必要时进行类型转换。例如，如果一个值是数字类型，而另一个值是字符串类型，但它们的数值内容相同，那么 `==` 会将它们视为相等。

### 案例 - 实现 clock 时钟的 web 服务器
核心思路 把文件的实际存放路径，作为每个资源的请求 url 地址。
	![](./assets/Pasted%20image%2020240112105432.png) 
```js
server.on('request', (req, res) => {
  // 3.1 获取到客户端请求的 URL 地址
  //     /clock/index.html
  //     /clock/index.css
  //     /clock/index.js
  const url = req.url
  // 3.2 把请求的 URL 地址映射为具体文件的存放路径
  // const fpath = path.join(__dirname, url)
  // 5.1 预定义一个空白的文件存放路径
  let fpath = ''
  if (url === '/') {
    fpath = path.join(__dirname, './clock/index.html')
  } else {
    //     /index.html
    //     /index.css
    //     /index.js
    fpath = path.join(__dirname, '/clock', url)
  }

  // 4.1 根据“映射”过来的文件路径读取文件的内容
  fs.readFile(fpath, 'utf8', (err, dataStr) => {
    // 4.2 读取失败，向客户端响应固定的“错误消息”
    if (err) return res.end('404 Not found.')
    // 4.3 读取成功，将读取成功的内容，响应给客户端
    res.end(dataStr)
  })
})
```