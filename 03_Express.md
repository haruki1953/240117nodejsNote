# 03_Express
## 初识 Express
### Express 简介
官方给出的概念：Express 是基于 Node.js 平台，快速、开放、极简的 Web 开发框架。 
通俗的理解：Express 的作用和 Node.js 内置的 http 模块类似，是专门用来创建 Web 服务器的。 
Express 的本质：就是一个 npm 上的第三方包，提供了快速创建 Web 服务器的便捷方法。
Express 的中文官网： http://www.expressjs.com.cn/

对于前端程序员来说，最常见的两种服务器，分别是： 
- Web 网站服务器：专门对外提供 Web 网页资源的服务器。 
-  API 接口服务器：专门对外提供 API 接口的服务器。 
使用 Express，我们可以方便、快速的创建 Web 网站的服务器或 API 接口的服务器。

### Express 的基本使用
安装 `npm i express@4.17.1`
```js
// 1. 导入 express
const express = require('express')
// 2. 创建 web 服务器
const app = express()

// 4. 监听客户端的 GET 和 POST 请求，并向客户端响应具体的内容
app.get('/user', (req, res) => {
  // 调用 express 提供的 res.send() 方法，向客户端响应一个 JSON 对象
  res.send({ name: 'zs', age: 20, gender: '男' })
})
app.post('/user', (req, res) => {
  // 调用 express 提供的 res.send() 方法，向客户端响应一个 文本字符串
  res.send('请求成功')
})
app.get('/', (req, res) => {
  // 通过 req.query 可以获取到客户端发送过来的 查询参数
  // 注意：默认情况下，req.query 是一个空对象
  console.log(req.query)
  res.send(req.query)
})
// 注意：这里的 :id 是一个动态的参数
app.get('/user/:ids/:username', (req, res) => {
  // req.params 是动态匹配到的 URL 参数，默认也是一个空对象
  console.log(req.params)
  res.send(req.params)
})

// 3. 启动 web 服务器
app.listen(80, () => {
  console.log('express server running at http://127.0.0.1')
})
```

### 托管静态资源
**express.static()**
通过express.static()，可以非常方便地创建一个静态资源服务器， 例如，通过如下代码就可以将 public 目录下的图片、CSS 文件、JavaScript 文件对外开放访问了：
```js
app.use(express.static('public'))
```
现在，就可以访问 public 目录中的所有文件了： 
http://localhost:3000/images/bg.jpg 
http://localhost:3000/css/style.css 
http://localhost:3000/js/login.js
注意：Express 在指定的静态目录中查找文件，并对外提供资源的访问路径。 因此，存放静态文件的目录名不会出现在 URL 中。
**托管多个静态资源目录**
如果要托管多个静态资源目录，请多次调用 express.static() 函数
访问静态资源文件时，express.static() 函数会根据目录的添加顺序查找所需的文件。
**挂载路径前缀**
```js
app.use('/public', express.static('public'))
```

### nodemon
在编写调试 Node.js 项目的时候，如果修改了项目的代码，则需要频繁的手动 close 掉，然后再重新启动，非常繁琐。 
现在，我们可以使用 nodemon（https://www.npmjs.com/package/nodemon） 这个工具，它能够监听项目文件 的变动，当代码被修改后，nodemon 会自动帮我们重启项目，极大方便了开发和调试。
**安装 nodemon**
`npm i -g nodemon`
**使用 nodemon**
现在，我们可以将 node 命令替换为 nodemon 命令，使用 nodemon app.js 来启动项目。这样做的好处是：代码 被修改之后，会被 nodemon 监听到，从而实现自动重启项目的效果。



## Express 路由
### 路由的概念
广义上来讲，路由就是映射关系。
在 Express 中，路由指的是**客户端的请求**与**服务器处理函数**之间的**映射关系**。 
Express 中的路由分 3 部分组成，分别是**请求的类型、请求的 URL 地址、处理函数**，格式如下：
```js
app.METHOD(PATH, HANDLER)
```
#### 路由的匹配过程
① 按照定义的先后顺序进行匹配 
② 请求类型和请求的URL同时匹配成功， 才会调用对应的处理函数

### 路由的使用
#### 最简单的用法
```js
const express = require('express')
const app = express()

// 挂载路由
app.get('/', (req, res) => {
  res.send('hello world.')
})
app.post('/', (req, res) => {
  res.send('Post Request.')
})

app.listen(80, () => {
  console.log('http://127.0.0.1')
})
```
#### 模块化路由
不建议将路由直接挂载到 app 上，而是推荐将路由抽离为单独的模块。
将路由抽离为单独模块的步骤如下：
① 创建路由模块对应的 .js 文件 
② 调用 express.Router() 函数创建路由对象 
③ 向路由对象上挂载具体的路由 
④ 使用 module.exports 向外共享路由对象 
⑤ 使用 app.use() 函数注册路由模块
#### 创建路由模块
```js
// 这是路由模块
// 1. 导入 express
const express = require('express')
// 2. 创建路由对象
const router = express.Router()

// 3. 挂载具体的路由
router.get('/user/list', (req, res) => {
  res.send('Get user list.')
})
router.post('/user/add', (req, res) => {
  res.send('Add new user.')
})

// 4. 向外导出路由对象
module.exports = router
```
#### 注册路由模块 为路由模块添加前缀
```js
const express = require('express')
const app = express()

// 1. 导入路由模块
const router = require('./03.router')
// 2. 注册路由模块
// 2.1 不添加前缀
app.use(router)
// 2.2 添加前缀
app.use('/api', router)
// 注意： app.use() 函数的作用，就是来注册全局中间件

app.listen(80, () => {
  console.log('http://127.0.0.1')
})
```
**路由模块添加前缀**，类似于托管静态资源时，为静态资源统一挂载访问前缀：
[【托管静态资源】2024-01-13-周六](2024-01-13-周六.md#托管静态资源)
```js
// 托管静态资源
app.use(express.static('./files')) // 不添加前缀
app.use('/files', express.static('./files')) // 添加前缀
```

## Express 中间件
### 中间件的概念
当一个请求到达 Express 的服务器之后，可以连续调用多个中间件，从而对这次请求进行预处理。
	![](./assets/Pasted%20image%2020240115103927.png) 
#### Express 中间件的格式
Express 的中间件，本质上就是一个 function 处理函数，Express 中间件的格式如下：
	![](./assets/Pasted%20image%2020240115104226.png) 
注意：中间件函数的形参列表中，必须包含 next 参数。而路由处理函数中只包含 req 和 res。
#### next 函数的作用
next 函数是实现多个中间件连续调用的关键，它表示把流转关系转交给下一个中间件或路由。
	![](./assets/Pasted%20image%2020240115104557.png) 
### Express 中间件的初体验
#### 定义中间件函数 全局生效的中间件
客户端发起的任何请求，到达服务器之后，都会触发的中间件，叫做全局生效的中间件。
通过调用 app.use(中间件函数)，即可定义一个全局生效的中间件，示例代码如下：
```js
// 定义一个最简单的中间件函数
const mw = function (req, res, next) {
  console.log('这是最简单的中间件函数')
  // 把流转关系，转交给下一个中间件或路由
  next()
}
// 将 mw 注册为全局生效的中间件
app.use(mw)


// 这是定义全局中间件的简化形式
app.use((req, res, next) => {
  console.log('这是最简单的中间件函数')
  next()
})
```

#### 中间件的作用
多个中间件之间，共享同一份 req 和 res。基于这样的特性，我们可以在上游的中间件中，统一为 req 或 res 对象添 加自定义的属性或方法，供下游的中间件或路由进行使用。

#### 定义多个全局中间件
可以使用 app.use() 连续定义多个全局中间件。客户端请求到达服务器之后，会按照中间件定义的先后顺序依次进行调用

#### 局部生效的中间件
不使用 app.use() 定义的中间件，叫做局部生效的中间件，示例代码如下：
```js
// 1. 定义中间件函数
const mw1 = (req, res, next) => {
  console.log('调用了局部生效的中间件')
  next()
}

// 2. 创建路由
app.get('/', mw1, (req, res) => {
  res.send('Home page.')
})
```
mw1 这个中间件只在"当前路由中生效"，这种用法属于"局部生效的中间件"
#### 定义多个局部中间件
```js
// 可以在路由中，通过如下两种等价的方式，使用多个局部中间件
app.get('/', mw1, mw2, (req, res) => {
  res.send('Home page.')
})
app.get('/', [mw1, mw2], (req, res) => {
  res.send('Home page.')
})
```
#### 了解中间件的5个使用注意事项
① 一定要在路由之前注册中间件 
② 客户端发送过来的请求，可以连续调用多个中间件进行处理 
③ 执行完中间件的业务代码之后，不要忘记调用 next() 函数 
④ 为了防止代码逻辑混乱，调用 next() 函数后不要再写额外的代码 
⑤ 连续调用多个中间件时，多个中间件之间，共享 req 和 res 对象

### 中间件的分类
为了方便大家理解和记忆中间件的使用，Express 官方把常见的中间件用法，分成了 5 大类，分别是： 
① 应用级别的中间件 
② 路由级别的中间件 
③ 错误级别的中间件 
④ Express 内置的中间件 
⑤ 第三方的中间件

#### 应用级别的中间件
通过 app.use() 或 app.get() 或 app.post() ，绑定到 app 实例上的中间件，叫做应用级别的中间件

#### 路由级别的中间件
绑定到 express.Router() 实例上的中间件，叫做路由级别的中间件。它的用法和应用级别中间件没有任何区别。只不过，应用级别中间件是绑定到 app 实例上，路由级别中间件绑定到 router 实例上
	![](./assets/Pasted%20image%2020240115134640.png) 

#### 错误级别的中间件
错误级别中间件的作用：专门用来捕获整个项目中发生的异常错误，从而防止项目异常崩溃的问题。
**格式**：错误级别中间件的 function 处理函数中，**必须有 4 个形参**，形参顺序从前到后，分别是 (err, req, res, next)。
```js
// 1. 定义路由
app.get('/', (req, res) => {
  // 1.1 人为的制造错误
  throw new Error('服务器内部发生了错误！')
  res.send('Home page.')
})

// 2. 定义错误级别的中间件，捕获整个项目的异常错误，从而防止程序的崩溃
app.use((err, req, res, next) => {
  console.log('发生了错误！' + err.message)
  res.send('Error：' + err.message)
})
```
**注意：错误级别的中间件， 必须注册在所有路由之后！**

#### Express内置的中间件
自 Express 4.16.0 版本开始，Express 内置了 3 个常用的中间件，极大的提高了 Express 项目的开发效率和体验： 
① express.static 快速托管静态资源的内置中间件，例如： HTML 文件、图片、CSS 样式等（无兼容性） 
② express.json 解析 JSON 格式的请求体数据（有兼容性，仅在 4.16.0+ 版本中可用）
③ express.urlencoded 解析 URL-encoded 格式的请求体数据（有兼容性，仅在 4.16.0+ 版本中可用）
**express.json 与 express.urlencoded 的使用**
```js
// 注意：除了错误级别的中间件，其他的中间件，必须在路由之前进行配置
// 通过 express.json() 这个中间件，解析表单中的 JSON 格式的数据
app.use(express.json())
// 通过 express.urlencoded() 这个中间件，来解析 表单中的 url-encoded 格式的数据
app.use(express.urlencoded({ extended: false }))

app.post('/user', (req, res) => {
  // 在服务器，可以使用 req.body 这个属性，来获取 JSON 格式的表单数据和 url-encoded 格式的数据
  // 默认情况下，如果不配置解析表单数据的中间件，则 req.body 默认等于 undefined
  console.log(req.body)
  res.send('ok')
})
```

#### 第三方的中间件
例如：在 express@4.16.0 之前的版本中，经常使用 body-parser 这个第三方中间件，来解析请求体数据。使用步骤如下： 
① 运行 npm install body-parser 安装中间件 
② 使用 require 导入中间件 
③ 调用 app.use() 注册并使用中间件
```js
// 1. 导入解析表单数据的中间件 body-parser
const parser = require('body-parser')
// 2. 使用 app.use() 注册中间件
app.use(parser.urlencoded({ extended: false }))
// app.use(express.urlencoded({ extended: false }))

app.post('/user', (req, res) => {
  console.log(req.body)
  res.send('ok')
})
```
Express 内置的 express.urlencoded 中间件，就是基于 body-parser 这个第三方中间件进一步封装出来的。

### 自定义中间件
自己手动模拟一个类似于 express.urlencoded 这样的中间件，来解析 POST 提交到服务器的表单数据。
实现步骤： 
① 定义中间件
② 监听 req 的 data 事件 
	在中间件中，需要监听 req 对象的 data 事件，来获取客户端发送到服务器的数据。 
	如果数据量比较大，无法一次性发送完毕，则客户端会把数据切割后，分批发送到服务器。所以 data 事件可能会触 发多次，每一次触发 data 事件时，获取到数据只是完整数据的一部分，需要手动对接收到的数据进行拼接。
③ 监听 req 的 end 事件 
	当请求体数据接收完毕之后，会自动触发 req 的 end 事件。
	因此，我们可以在 req 的 end 事件中，拿到并处理完整的请求体数据。
④ 使用 querystring 模块解析请求体数据
	Node.js 内置了一个 querystring 模块，专门用来处理查询字符串。通过这个模块提供的 parse() 函数，可以轻松把查询字符串，解析成对象的格式。
⑤ 将解析出来的数据对象挂载为 req.body
	上游的中间件和下游的中间件及路由之间，共享同一份 req 和 res。因此，我们可以将解析出来的数据，挂载为 req 的自定义属性，命名为 req.body，供下游使用。示例代码如下：
⑥ 将自定义中间件封装为模块
```js
// custom-body-parser.js模块中的代码
// 导入 Node.js 内置的 querystring 模块
const qs = require('querystring')

const bodyParser = (req, res, next) => {
  // 定义中间件具体的业务逻辑
  // 1. 定义一个 str 字符串，专门用来存储客户端发送过来的请求体数据
  let str = ''
  // 2. 监听 req 的 data 事件
  req.on('data', (chunk) => {
    str += chunk
  })
  // 3. 监听 req 的 end 事件
  req.on('end', () => {
    // 在 str 中存放的是完整的请求体数据
    // console.log(str)
    // 把字符串格式的请求体数据，解析成对象格式
    const body = qs.parse(str)
    req.body = body
    next()
  })
}
// 向外导出解析请求体数据的中间件函数
module.exports = bodyParser

// --- 分割线 ---

// 1. 导入自己封装的中间件模块
const customBodyParser = require('./custom-body-parser')
// 2. 将自定义的中间件函数，注册为全局可用的中间件
app.use(customBodyParser)

```




## 使用 Express 写接口
### 编写 GET 接口
**req.query 获取客户端通过查询字符串，发送到服务器的数据**
```js
router.get('/get', (req, res) => {
  // 通过 req.query 获取客户端通过查询字符串，发送到服务器的数据
  const query = req.query
  // 调用 res.send() 方法，向客户端响应处理的结果
  res.send({
    status: 0, // 0 表示处理成功，1 表示处理失败
    msg: 'GET 请求成功！', // 状态的描述
    data: query, // 需要响应给客户端的数据
  })
})
```
### 编写 POST 接口
**req.body 获取请求体中的数据**
```js
router.post('/post', (req, res) => {
  // 通过 req.body 获取请求体中包含的 url-encoded 格式的数据
  const body = req.body
  // 调用 res.send() 方法，向客户端响应结果
  res.send({
    status: 0,
    msg: 'POST 请求成功！',
    data: body,
  })
})
```
注意：如果要获取 URL-encoded 格式的请求体数据，必须配置中间件 app.use(express.urlencoded({ extended: false }))

### CORS 跨域资源共享
#### 接口的跨域问题
```html
<script>
  $(function () {
    // 1. 测试GET接口
    $('#btnGET').on('click', function () {
      $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1/api/get',
        data: { name: 'zs', age: 20 },
        success: function (res) {
          console.log(res)
        },
      })
    })
</script>
```
刚才编写的 GET 和 POST接口，存在一个很严重的问题：不支持跨域请求
前端页面与后端接口的协议、域名、端口号，任何一项不同都会存在跨域的问题
	![](./assets/Pasted%20image%2020240116093339.png) 
解决接口跨域问题的方案主要有两种： 
① CORS（主流的解决方案，推荐使用）
② JSONP（有缺陷的解决方案：只支持 GET 请求）

#### 使用 cors 中间件解决跨域问题
cors 是 Express 的一个第三方中间件
使用步骤分为如下 3 步： 
① 运行 npm install cors 安装中间件 
② 使用 const cors = require('cors') 导入中间件 
③ 在路由之前调用 app.use(cors()) 配置中间件

#### 什么是 CORS
CORS （Cross-Origin Resource Sharing，跨域资源共享）由一系列 HTTP 响应头组成，这些 HTTP 响应头决定 浏览器是否阻止前端 JS 代码跨域获取资源。 
浏览器的同源安全策略默认会阻止网页“跨域”获取资源。但如果接口服务器配置了 CORS 相关的 HTTP 响应头， 就可以解除浏览器端的跨域访问限制。
	![](./assets/Pasted%20image%2020240116094344.png) 

#### CORS 的注意事项
① CORS 主要在服务器端进行配置。客户端浏览器无须做任何额外的配置，即可请求开启了 CORS 的接口。 
② CORS 在浏览器中有兼容性。只有支持 XMLHttpRequest Level2 的浏览器，才能正常访问开启了 CORS 的服 务端接口（例如：IE10+、Chrome4+、FireFox3.5+）。

#### CORS 响应头部 - Access-Control-Allow-Origin
响应头部中可以携带一个 Access-Control-Allow-Origin 字段，其语法如下:
`Access-Control-Allow-Origin: <origin> | *`
其中，origin 参数的值指定了允许访问该资源的外域 URL。 
例如，下面的字段值将只允许来自 http://itcast.cn 的请求：
```js
res.setHeader('Access-Control-Allow-Origin', 'http://itcast.cn')
```

如果指定了 Access-Control-Allow-Origin 字段的值为通配符 `*`，表示允许来自任何域的请求
```js
res.setHeader('Access-Control-Allow-Origin', '*')
```

#### CORS 响应头部 - Access-Control-Allow-Headers
默认情况下，CORS 仅支持客户端向服务器发送如下的 9 个请求头： 
Accept、Accept-Language、Content-Language、DPR、Downlink、Save-Data、Viewport-Width、Width 、 Content-Type （值仅限于 text/plain、multipart/form-data、application/x-www-form-urlencoded 三者之一） 
如果客户端向服务器发送了额外的请求头信息，则需要在服务器端，通过 Access-Control-Allow-Headers 对额外 的请求头进行声明，否则这次请求会失败！
```js
// 允许客户端额外向服务器发送Content-Type 请求头和 X-Custom-Header请求头
// 注意:多个请求头之间使用英文的逗号进行分割
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Custom-Header')
```

#### CORS 响应头部 - Access-Control-Allow-Methods
默认情况下，CORS 仅支持客户端发起 GET、POST、HEAD 请求。 
如果客户端希望通过 PUT、DELETE 等方式请求服务器的资源，则需要在服务器端，通过 Access-Control-Alow-Methods 来指明实际请求所允许使用的 HTTP 方法。
```js
// 只允许 POST、GET、DELETE、HEAD 请求方法
res.setHeader('Access-Control-Allow-Methods'，'POST, GET, DELETE, HEAD')
// 允许所有的 HTTP请求方法
res.setHeader('Access-Control-Allow-Methods','*')
```

#### CORS请求的分类
客户端在请求 CORS 接口时，根据请求方式和请求头的不同，可以将 CORS 的请求分为两大类，分别是： 
① 简单请求 
② 预检请求

**简单请求**
同时满足以下两大条件的请求，就属于简单请求： 
① 请求方式：GET、POST、HEAD 三者之一 
② HTTP 头部信息不超过以下几种字段：无自定义头部字段、Accept、Accept-Language、Content-Language、DPR、 Downlink、Save-Data、Viewport-Width、Width 、Content-Type（只有三个值application/x-www-formurlencoded、multipart/form-data、text/plain）

**预检请求**
只要符合以下任何一个条件的请求，都需要进行预检请求： 
① 请求方式为 GET、POST、HEAD 之外的请求 Method 类型 
② 请求头中包含自定义头部字段 
③ 向服务器发送了 application/json 格式的数据 
在浏览器与服务器正式通信之前，浏览器会先发送 OPTION 请求进行预检，以获知服务器是否允许该实际请求，所以这一 次的 OPTION 请求称为“预检请求”。服务器成功响应预检请求后，才会发送真正的请求，并且携带真实数据。

**简单请求和预检请求的区别**
简单请求的特点：客户端与服务器之间只会发生一次请求。 
预检请求的特点：客户端与服务器之间会发生两次请求，OPTION 预检请求成功之后，才会发起真正的请求。

### JSONP 接口
#### JSONP 的概念与特点
概念：浏览器端通过 `<script>` 标签的 src 属性，请求服务器上的数据，同时，服务器返回一个函数的调用。这种请求数据的方式叫做 JSONP。
特点：
① JSONP 不属于真正的 Ajax 请求，因为它没有使用 XMLHttpRequest 这个对象。
② JSONP 仅支持 GET 请求，不支持 POST、PUT、DELETE 等请求。

#### 创建 JSONP 接口的注意事项
如果项目中已经配置了 CORS 跨域资源共享，为了防止冲突，必须在配置 CORS 中间件之前声明 JSONP 的接口。否则 JSONP 接口会被处理成开启了 CORS 的接口。

#### 实现 JSONP 接口
① 获取客户端发送过来的回调函数的名字 
② 得到要通过 JSONP 形式发送给客户端的数据 
③ 根据前两步得到的数据，拼接出一个函数调用的字符串 
④ 把上一步拼接得到的字符串，响应给客户端的
```js
// 必须在配置 cors 中间件之前，配置 JSONP 的接口
app.get('/api/jsonp', (req, res) => {
  // TODO: 定义 JSONP 接口具体的实现过程
  // 1. 得到函数的名称
  const funcName = req.query.callback
  // 2. 定义要发送到客户端的数据对象
  const data = { name: 'zs', age: 22 }
  // 3. 拼接出一个函数的调用
  const scriptStr = `${funcName}(${JSON.stringify(data)})`
  // 4. 把拼接的字符串，响应给客户端
  res.send(scriptStr)
})
```
```js
// 4. 为 JSONP 按钮绑定点击事件处理函数
$('#btnJSONP').on('click', function () {
  $.ajax({
	type: 'GET',
	url: 'http://127.0.0.1/api/jsonp',
	dataType: 'jsonp',
	success: function (res) {
	  console.log(res)
	},
  })
})
```