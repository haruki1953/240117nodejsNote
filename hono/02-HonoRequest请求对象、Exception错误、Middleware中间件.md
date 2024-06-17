## HonoRequest请求对象
https://hono.dev/api/request

`HonoRequest` 在Context上下文中 `c.req` ，它包装了一个 [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) 对象。

### param()
获取路径参数的值。
```ts
// Captured params
app.get('/entry/:id', (c) => {
  const id = c.req.param('id')
  ...
})

// Get all params at once
app.get('/entry/:id/comment/:commentId', (c) => {
  const { id, commentId } = c.req.param()
})
```

### query()
获取查询字符串参数。
```ts
// Query params
app.get('/search', (c) => {
  const query = c.req.query('q')
  ...
})

// Get all params at once
app.get('/search', (c) => {
  const { q, limit, offset } = c.req.query()
  ...
})
```

### queries()
获取多个查询字符串参数值，例如 `/search?tags=A&tags=B`
```ts
app.get('/search', (c) => {
  // tags will be string[]
  const tags = c.req.queries('tags')
  ...
})
```

### header()
获取请求标头值。
```ts
app.get('/', (c) => {
  const userAgent = c.req.header('User-Agent')
  ...
})
```

### parseBody()
解析请求主体类型 `multipart/form-data` 或者 `application/x-www-form-urlencoded`
```ts
app.post('/entry', async (c) => {
  const body = await c.req.parseBody()
  ...
})
```
https://hono.dev/api/request#parsebody

### json()
解析请求体类型 `application/json`
```ts
app.post('/entry', async (c) => {
  const body = await c.req.json()
  ...
})
```

### text()
解析请求体类型 `text/plain`

### valid()
获取经过验证的数据。
```
app.post('/posts', (c) => {
  const { title, body } = c.req.valid('form')
  ...
})
```
可用目标如下。

- `form`
- `json`
- `query`
- `header`
- `cookie`
- `param`

请参阅 [验证部分。](https://hono.dev/guides/validation) 有关使用示例，

### routePath()
您可以像这样检索处理程序中的注册路径：
```ts
app.get('/posts/:id', (c) => {
  return c.json({ path: c.req.routePath })
})
```
如果您访问 `/posts/123`，它将返回 `/posts/:id`:
```json
{ "path": "/posts/:id" }
```

### matchedRoutes()
它在处理程序中返回匹配的路由，这对于调试很有用。
https://hono.dev/api/request#matchedroutes

### path
请求路径名。
```ts
app.get('/about/me', (c) => {
  const pathname = c.req.path // `/about/me`
  ...
})
```

### url
请求 url 字符串。
```ts
app.get('/about/me', (c) => {
  const url = c.req.url // `http://localhost:8787/about/me`
  ...
})
```

### method
请求的方法名称。
```ts
app.get('/about/me', (c) => {
  const method = c.req.method // `GET`
  ...
})
```

### raw
原始的 [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) 对象。
https://hono.dev/api/request#raw


## Exception错误
当发生致命错误（例如身份验证失败）时，必须抛出 HTTPException。

### 抛出 HTTPException
此示例从中间件抛出 HTTPException。
```ts
import { HTTPException } from 'hono/http-exception'

// ...

app.post('/auth', async (c, next) => {
  // authentication
  if (authorized === false) {
    throw new HTTPException(401, { message: 'Custom error message' })
  }
  await next()
})
```

您可以指定要返回给用户的响应。
```ts
const errorResponse = new Response('Unauthorized', {
  status: 401,
  headers: {
    Authenticate: 'error="invalid_token"',
  },
})
throw new HTTPException(401, { res: errorResponse })
```

### 处理HTTPException
您可以使用 `app.onError` 处理抛出的 HTTPException 
```ts
import { HTTPException } from 'hono/http-exception'

// ...

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // Get the custom response
    return err.getResponse()
  }
  //...
})
```

### `cause`
`cause` 选项可用于添加 [`cause`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause) 数据。
```ts
app.post('/auth', async (c, next) => {
  try {
    authorize(c)
  } catch (e) {
    throw new HTTPException(401, { message, cause: e })
  }
  await next()
})
```


## Middleware中间件
中间件在处理程序（Handler）之前或之后工作。我们可以在分派请求之前获取请求，或者在分派之后处理响应。

### 中间件的定义
- **处理程序（Handler）**：应该返回 `Response` 对象。每次请求只会调用一个处理程序。
- **中间件（Middleware）**：不返回任何内容，通过 `await next()` 继续执行下一个中间件。

用户可以使用 `app.use` 或 `app.HTTP_METHOD` 注册中间件和处理程序。这使得指定路径和方法变得容易。
```ts
// 匹配任何方法、所有路由
app.use(logger())

// 指定路径
app.use('/posts/*', cors())

// 指定方法和路径
app.post('/posts/*', basicAuth())
```

如果处理程序返回 `Response`，它将被用于最终用户，并停止进一步处理。
```ts
app.post('/posts', (c) => c.text('Created!', 201))
```

在这种情况下，在分派请求之前，会按如下顺序处理四个中间件：
```ts
logger() -> cors() -> basicAuth() -> *handler*
```

### 执行顺序
中间件的执行顺序由其注册顺序决定。最先注册的中间件在调用 `next` 之前的过程最先执行，而在调用 `next` 之后的过程最后执行。请参见下图。
```ts
app.use(async (_, next) => {
  console.log('middleware 1 start')
  await next()
  console.log('middleware 1 end')
})
app.use(async (_, next) => {
  console.log('middleware 2 start')
  await next()
  console.log('middleware 2 end')
})
app.use(async (_, next) => {
  console.log('middleware 3 start')
  await next()
  console.log('middleware 3 end')
})

app.get('/', (c) => {
  console.log('handler')
  return c.text('Hello!')
})
```

结果如下。
```
middleware 1 start
  middleware 2 start
    middleware 3 start
      handler
    middleware 3 end
  middleware 2 end
middleware 1 end
```

### 内置中间件
Hono 有内置的中间件。
```ts
import { Hono } from 'hono'
import { poweredBy } from 'hono/powered-by'
import { logger } from 'hono/logger'
import { basicAuth } from 'hono/basic-auth'

const app = new Hono()

app.use(poweredBy())
app.use(logger())

app.use(
  '/auth/*',
  basicAuth({
    username: 'hono',
    password: 'acoolproject',
  })
)
```
https://hono.dev/middleware/builtin/basic-auth

### 定制中间件
可以直接在 `app.use()` 里面写自己的中间件
```ts
// Custom logger
app.use(async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`)
  await next()
})

// Add a custom header
app.use('/message/*', async (c, next) => {
  await next()
  c.header('x-message', 'This is middleware!')
})

app.get('/message/hello', (c) => c.text('Hello Middleware!'))
```

然而，直接在 `app.use()` 中嵌入中间件会限制其重用性。因此，我们可以将中间件分离到不同的文件中。

为了在分离中间件时不丢失上下文和 next 的类型定义，我们可以使用 hono/factory 的 `createMiddleware()`。
```ts
import { createMiddleware } from 'hono/factory'

const logger = createMiddleware(async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`)
  await next()
})
```

#### 在 Next 之后修改响应
可以设计中间件在必要时修改响应：
```ts
const stripRes = createMiddleware(async (c, next) => {
  await next()
  c.res = undefined
  c.res = new Response('New Response')
})
```