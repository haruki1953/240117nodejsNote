## 快速开始
https://hono.dev/top
https://hono.dev/getting-started/basic
### 创建hono项目
pnpm create hono@latest
```
? Target directory 240615-hono-demo（项目名）
? Which template do you want to use? nodejs（选择多种模板，这里选node）
√ Cloning the template
? Do you want to install project dependencies? yes（完成后立刻安装依赖）
? Which package manager do you want to use? pnpm（使用pnpm）
√ Installing project dependencies
🎉 Copied project files
Get started with: cd 240615-hono-demo

启动项目 pnpm dev
```

```ts
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
```

和express还是类似的，很好理解

## App
https://hono.dev/api/hono

一个 `Hono` 实例有以下方法
```ts
// 路由相关
app.HTTP_METHOD([path,]handler|middleware...)
app.all([path,]handler|middleware...)
app.on(method|method[], path|path[], handler|middleware...)
app.use([path,]middleware)
app.route(path, [app])
app.basePath(path)

app.notFound(handler)
app.onError(err, handler)
app.mount(path, anotherApp)
app.fire()
app.fetch(request, env, event)
app.request(path, options)
```

路由相关的后面再讲，剩下的也先讲感觉会用到的

#### `app.notFound`
自定义“未找到”响应。
```ts
app.notFound((c) => {
  return c.text('Custom 404 Message', 404)
})
```

### `app.onError`
捕获错误
```ts
app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})
```

### `app.request`
有用的测试方法,
传递 URL 或路径名来发送 GET 请求。 `app` 将返回一个 `Response` 目的。
```ts
test('GET /hello is ok', async () => {
  const res = await app.request('/hello')
  expect(res.status).toBe(200)
})
```
[散装笔记【Jest测试框架】](笔记/散装笔记.md#Jest测试框架)
测试以后要学

### 严格模式
严格模式默认为 `true` 并区分以下路线。
- `/hello`
- `/hello/`

`app.get('/hello')` 不会匹配 `GET /hello/`.
通过将严格模式设置为 `false`，两条路径将被同等对待。
```ts
const app = new Hono({ strict: false })
```


## 路由
https://hono.dev/api/routing
```ts
// HTTP Methods
app.get('/', (c) => c.text('GET /'))
app.post('/', (c) => c.text('POST /'))
app.put('/', (c) => c.text('PUT /'))
app.delete('/', (c) => c.text('DELETE /'))

// Wildcard通配符
app.get('/wild/*/card', (c) => {
  return c.text('GET /wild/*/card')
})

// Any HTTP methods 全部http方法
app.all('/hello', (c) => c.text('Any Method /hello'))

// Custom HTTP method 自定义http方法
app.on('PURGE', '/cache', (c) => c.text('PURGE Method /cache'))

// Multiple Method 多个方法
app.on(['PUT', 'DELETE'], '/post', (c) => c.text('PUT or DELETE /post'))

// Multiple Paths 多个路径
app.on('GET', ['/hello', '/ja/hello', '/en/hello'], (c) => c.text('Hello'))
```

### 路径参数
```ts
app.get('/user/:name', (c) => {
  const name = c.req.param('name')
  ...
})
```
或一次获取所有参数：
```ts
app.get('/posts/:id/comment/:comment_id', (c) => {
  const { id, comment_id } = c.req.param()
  ...
})
```

#### 可选参数
```ts
// Will match `/api/animal` and `/api/animal/:type`
app.get('/api/animal/:type?', (c) => c.text('Animal!'))
```

#### 正则表达式
```ts
app.get('/post/:date{[0-9]+}/:title{[a-z]+}', (c) => {
  const { date, title } = c.req.param()
  ...
})
```

#### 包括斜杠
```ts
app.get('/posts/:filename{.+\\.png$}', (c) => {
  //...
})
```

### 分组【重要】
可以使用 Hono 实例对路由进行分组，并使用 route 方法将它们添加到主应用程序中。
```ts
const book = new Hono()

book.get('/', (c) => c.text('List Books')) // GET /book
book.get('/:id', (c) => {
  // GET /book/:id
  const id = c.req.param('id')
  return c.text('Get Book: ' + id)
})
book.post('/', (c) => c.text('Create Book')) // POST /book

const app = new Hono()
app.route('/book', book)
```

#### 不改变基础路径的分组
```ts
const book = new Hono()
book.get('/book', (c) => c.text('List Books')) // GET /book
book.post('/book', (c) => c.text('Create Book')) // POST /book

const user = new Hono().basePath('/user')
user.get('/', (c) => c.text('List Users')) // GET /user
user.post('/', (c) => c.text('Create User')) // POST /user

const app = new Hono()
app.route('/', book) // Handle /book 
app.route('/', user) // Handle /user
```

### 使用主机名进行路由
```ts
const app = new Hono({
  getPath: (req) => req.url.replace(/^https?:\/(.+?)$/, '$1'),
})

app.get('/www1.example.com/hello', (c) => c.text('hello www1'))
app.get('/www2.example.com/hello', (c) => c.text('hello www2'))
```

### 路由优先级
处理程序或中间件将按注册顺序执行。


## Context
路由处理函数中的 c 即为 Context
### req
```ts
app.get('/hello', (c) => {
  const userAgent = c.req.header('User-Agent')
  ...
})
```

### body()
返回 HTTP 响应。
您可以使用以下方式设置标题 `c.header()` 并设置 HTTP 状态代码 `c.status`。 这也可以设置在 `c.text()`, `c.json()` 等等。
> **注意** ：返回Text或HTML时，建议使用 `c.text()` 或者 `c.html()`

```ts
app.get('/welcome', (c) => {
  // Set headers
  c.header('X-Message', 'Hello!')
  c.header('Content-Type', 'text/plain')

  // Set HTTP status code
  c.status(201)

  // Return the response body
  return c.body('Thank you for coming')
})
```

您还可以编写以下内容。
```ts
app.get('/welcome', (c) => {
  return c.body('Thank you for coming', 201, {
    'X-Message': 'Hello!',
    'Content-Type': 'text/plain',
  })
})
```

响应与下面相同。
```ts
new Response('Thank you for coming', {
  status: 201,
  headers: {
    'X-Message': 'Hello!',
    'Content-Type': 'text/plain',
  },
})
```

### text()
将文本渲染为 `Content-Type:text/plain`.
```ts
app.get('/say', (c) => {
  return c.text('Hello!')
})
```

### json()
将 JSON 渲染为 `Content-Type:application/json`.
```ts
app.get('/api', (c) => {
  return c.json({ message: 'Hello!' })
})
```

### html()
将 HTML 渲染为 `Content-Type:text/html`.
```ts
app.get('/', (c) => {
  return c.html('<h1>Hello! Hono!</h1>')
})
```

### notFound()
返回 `Not Found` 回复。
```ts
app.get('/notfound', (c) => {
  return c.notFound()
})
```

### redirect()
重定向，默认状态码为 `302`.
```ts
app.get('/redirect', (c) => {
  return c.redirect('/')
})
app.get('/redirect-permanently', (c) => {
  return c.redirect('/', 301)
})
```

### 以下多为在中间件中使用
中间件 https://hono.dev/guides/middleware
`await next()` 是需要await的，await之后可以写处理函数结束之后要做的事

### res
```ts
// Response object
app.use('/', async (c, next) => {
  await next()
  c.res.headers.append('X-Debug', 'Debug message')
})
```
每个请求完成后，响应头中会添加 `X-Debug` 字段。

### set() / get()
设置由键指定的值 `set` ，并稍后使用它 `get`.
```ts
app.use(async (c, next) => {
  c.set('message', 'Hono is cool!!')
  await next()
})

app.get('/', (c) => {
  const message = c.get('message')
  return c.text(`The message is "${message}"`)
})
```

使用 `Variables` 作为 `Hono` 构造函数的泛型，使其类型安全。
```ts
type Variables = {
  message: string
}

const app = new Hono<{ Variables: Variables }>()
```

### var
还可以使用以下方式访问上下文中变量的值 `c.var`
```ts
const result = c.var.client.oneMethod()
```
- **`c.var.client`**：这是一个自定义变量
- **`oneMethod()`**：这是 `client` 对象上的一个方法

如果你想创建提供自定义方法的中间件，请像下面这样编写：
```ts
type Env = {
  Variables: {
    echo: (str: string) => string
  }
}

const app = new Hono()

const echoMiddleware = createMiddleware<Env>(async (c, next) => {
  c.set('echo', (str) => str)
  await next()
})

app.get('/echo', echoMiddleware, (c) => {
  return c.text(c.var.echo('Hello!'))
})
```

如果你想在多个处理程序中使用中间件，你可以使用 `app.use()`。 然后，你必须通过 `Env` 作为 `Hono` 构造函数的泛型 使其类型安全。
```ts
const app = new Hono<Env>()

app.use(echoMiddleware)

app.get('/echo', (c) => {
  return c.text(c.var.echo('Hello!'))
})
```

### render() / setRenderer()
用于服务端渲染，自己暂时用不到
https://hono.dev/api/context#render-setrenderer


### executionCtx、event、env
```ts
// ExecutionContext object
app.get('/foo', async (c) => {
  c.executionCtx.waitUntil(
    c.env.KV.put(key, data)
  )
  ...
})
```
`c.executionCtx.waitUntil` 方法在 Hono 框架中用于管理异步任务，确保这些任务可以在请求生命周期之外继续执行。这对于需要处理后台任务、记录日志或异步数据同步的场景非常有用。通过这种方式，可以在不阻塞主请求处理的情况下，执行额外的异步操作。

以下多在Cloudflare Workers使用，先不深入了解
https://hono.dev/api/context#executionctx
https://hono.dev/api/context#event
https://hono.dev/api/context#env

### error
如果 Handler 抛出错误，则错误对象被放置在 `c.error`。 您可以在中间件中访问它。
```ts
app.use(async (c, next) => {
  await next()
  if (c.error) {
    // do something...
  }
})
```

### ContextVariableMap上下文变量映射
例如，如果您希望在使用特定中间件时向变量添加类型定义，您可以扩展 `ContextVariableMap`。 例如：
```ts
declare module 'hono' {
  interface ContextVariableMap {
    result: string
  }
}
```

然后您可以在中间件中使用它：
```ts
const mw = createMiddleware(async (c, next) => {
  c.set('result', 'some values') // result is a string
  await next()
})
```

在处理程序中，变量被推断为正确的类型：
```ts
app.get('/', (c) => {
  const val = c.get('result') // val is a string
  //...
})
```
> 也可以通过使用前面提到的 `Variables` 作为 `Hono` 构造函数的泛型来实现，区别在于ContextVariableMap可以直接设置全部hono实例

[散装笔记【declare】](笔记/散装笔记.md#declare)
