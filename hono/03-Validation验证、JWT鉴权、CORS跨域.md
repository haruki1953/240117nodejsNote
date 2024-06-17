## Validation验证
Hono 只提供了一个非常简单的 Validator。 但是，与第三方验证器结合使用时它会非常强大。 此外，RPC 功能允许您通过类型与客户端共享 API 规范。

https://hono.dev/guides/validation

### 手动验证器
首先，介绍一种不使用第三方验证器来验证传入值的方法。
从 `hono/validator` 导入验证器。
```ts
import { validator } from 'hono/validator'
```

要验证表单数据，指定 `form` 作为第一个参数，回调函数作为第二个参数。在回调函数中验证值，并在最后返回验证后的值。验证器可以用作中间件。
```ts
app.post(
  '/posts',
  validator('form', (value, c) => {
    const body = value['body']
    if (!body || typeof body !== 'string') {
      return c.text('Invalid!', 400)
    }
    return {
      body: body,
    }
  }),
  //...
```

在处理程序中，可以使用 `c.req.valid('form')` 获取验证后的值。
```ts
, (c) => {
  const { body } = c.req.valid('form')
  // ... 做一些事情
  return c.json(
    {
      message: 'Created!',
    },
    201
  )
}
```
验证目标包括 `json`、`query`、`header`、`param` 和 `cookie`，除此之外还有 `form`。

### 多个验证器
您还可以包含多个验证器来验证请求的不同部分：
```ts
app.post(
  '/posts/:id',
  validator('param', ...),
  validator('query', ...),
  validator('json', ...),
  (c) => {
    //... 
  }
```

### Zod
您可以使用 [Zod](https://zod.dev) ，第三方验证器之一。 我们建议使用第三方验证器。
```
pnpm add zod
```

从zod导入z
```ts
import { z } from 'zod'
```

写下你的 校验信息（schema）。
```ts
const schema = z.object({
  body: z.string(),
})
```

您可以使用回调函数中的架构进行验证并返回验证后的值。
```ts
const route = app.post(
  '/posts',
  validator('form', (value, c) => {
    const parsed = schema.safeParse(value)
    if (!parsed.success) {
      return c.text('Invalid!', 401)
    }
    return parsed.data
  }),
  (c) => {
    const { body } = c.req.valid('form')
    // ... do something
    return c.json(
      {
        message: 'Created!',
      },
      201
    )
  }
)
```

### Zod 验证器中间件
您可以使用 [Zod Validator 中间件](https://github.com/honojs/middleware/tree/main/packages/zod-validator) 使其变得更加容易。
```
pnpm add @hono/zod-validator
```
```ts
import { zValidator } from '@hono/zod-validator'
```
```ts
const route = app.post(
  '/posts',
  zValidator(
    'form',
    z.object({
      body: z.string(),
    })
  ),
  (c) => {
    const validated = c.req.valid("form");
    // ... use your validated data
  }
)
```

### RPC
（不太会，先了解一下吧）
RPC 功能允许在服务器和客户端之间共享 API 规范。
https://hono.dev/guides/rpc


## JWT鉴权
该帮助器提供编码、解码、签名和验证 JSON Web 令牌 (JWT) 的功能。 JWT 通常用于 Web 应用程序中的身份验证和授权目的。 该助手提供强大的 JWT 功能，支持各种加密算法。

要使用此帮助程序，您可以按如下方式导入它：
```ts
import { decode, sign, verify } from 'hono/jwt'
```

### `sign()`
此函数通过对有效负载进行编码并使用指定的算法和密钥对其进行签名来生成 JWT 令牌。
```ts
sign(
  payload: unknown,
  secret: string,
  alg?: 'HS256';
): Promise<string>;
```

#### 例子
```ts
import { sign } from 'hono/jwt'

const payload = {
  sub: 'user123',
  role: 'admin',
  exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
}
const secret = 'mySecretKey'
const token = await sign(payload, secret)
```

#### 选项
- `payload`: 未知 - 必需
    - 要签名的 JWT 有效负载。 您可以包含其他声明，例如 [Payload Validation](https://hono.dev/helpers/jwt#payload-validation) 中的声明。
- `secret`: 字符串 - 必需
    - 用于 JWT 验证或签名的密钥。
- `alg`: [算法类型](https://hono.dev/helpers/jwt#supported-algorithmtypes)
    - 用于 JWT 签名或验证的算法。 默认为 HS256。

### `verify()`
此函数检查 JWT 令牌是否真实且仍然有效。 它确保令牌未被更改，并且仅在您添加 [Payload Validation](https://hono.dev/helpers/jwt#payload-validation) 时才检查有效性
```ts
verify(
  token: string,
  secret: string,
  alg?: 'HS256';
): Promise<any>;
```

#### 例子
```ts
import { verify } from 'hono/jwt'

const tokenToVerify = 'token'
const secretKey = 'mySecretKey'

const decodedPayload = await verify(tokenToVerify, secretKey)
console.log(decodedPayload)
```

#### 选项
- `token`: 字符串 - 必需
    - 要验证的 JWT 令牌。
- `secret`: 字符串 - 必需
    - 用于 JWT 验证或签名的密钥。
- `alg`: [算法类型](https://hono.dev/helpers/jwt#supported-algorithmtypes)
    - 用于 JWT 签名或验证的算法。 默认为 HS256。

### `decode()`
此函数在不执行签名验证的情况下解码 JWT 令牌。 它从令牌中提取并返回标头和有效负载。
```ts
decode(token: string): { header: any; payload: any };
```

#### 例子
```ts
import { decode } from 'hono/jwt'

// Decode the JWT token
const tokenToDecode =
 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJzdWIiOiAidXNlcjEyMyIsICJyb2xlIjogImFkbWluIn0.JxUwx6Ua1B0D1B0FtCrj72ok5cm1Pkmr_hL82sd7ELA'

const { header, payload } = decode(tokenToDecode)

console.log('Decoded Header:', header)
console.log('Decoded Payload:', payload)
```

### 选项
- `token`: 字符串 - 必需
    - 要解码的 JWT 令牌。
> `decode`函数允许您检查 JWT 令牌的标头和有效负载， _**而无需**_ 执行验证。 这对于调试或从 JWT 令牌中提取信息非常有用。


### Payload Validation 有效负载验证
验证 JWT 令牌时，将执行以下有效负载验证：
- `exp`：检查令牌以确保其尚未过期。
- `nbf`：检查令牌以确保其在指定时间之前未被使用。
- `iat`：检查令牌以确保将来不再发行。

如果您打算在验证期间执行这些检查，请确保您的 JWT 负载包含这些字段作为对象。

#### 详细说明
#### 1. **exp（Expiration Time）**
`exp` 字段表示令牌的过期时间。它通常是一个 Unix 时间戳，表示从 1970 年 1 月 1 日以来的秒数。验证过程中，服务器会检查当前时间是否在这个时间戳之后，如果是，则认为令牌已经过期。
```json
{
  "exp": 1716239022
}
```

#### 2. **nbf（Not Before）**
`nbf` 字段表示令牌在指定时间之前不可用。与 `exp` 类似，它也是一个 Unix 时间戳。验证过程中，服务器会检查当前时间是否在这个时间戳之后，如果是，则认为令牌有效。
```json
{
  "nbf": 1716239022
}
```

#### 3. **iat（Issued At）**
`iat` 字段表示令牌的签发时间。它同样是一个 Unix 时间戳。验证过程中，服务器会检查当前时间是否在这个时间戳之后，如果不是，则认为令牌无效（例如，令牌被伪造或时间被篡改）。
```json
{
  "iat": 1716239022
}
```

### 自定义错误类型
该模块还定义了处理与 JWT 相关错误的自定义错误类型。
- **JwtAlgorithmNotImplemented**：表示请求的 JWT 算法未实现。
- **JwtTokenInvalid**：表示 JWT 令牌无效。
- **JwtTokenNotBefore**：表示令牌在其有效日期之前被使用。
- **JwtTokenExpired**：表示令牌已过期。
- **JwtTokenIssuedAt**：表示令牌中的 `iat` 声明不正确。
- **JwtTokenSignatureMismatched**：表示令牌中的签名不匹配。

### 支持的算法类型
该模块支持以下 JWT 加密算法：
- **HS256**：使用 SHA-256 的 HMAC
- **HS384**：使用 SHA-384 的 HMAC
- **HS512**：使用 SHA-512 的 HMAC
- **RS256**：使用 SHA-256 的 RSASSA-PKCS1-v1_5
- **RS384**：使用 SHA-384 的 RSASSA-PKCS1-v1_5
- **RS512**：使用 SHA-512 的 RSASSA-PKCS1-v1_5
- **PS256**：使用 SHA-256 和 MGF1 的 RSASSA-PSS
- **PS384**：使用 SHA-384 和 MGF1 的 RSASSA-PSS
- **PS512**：使用 SHA-512 和 MGF1 的 RSASSA-PSS
- **ES256**：使用 P-256 和 SHA-256 的 ECDSA
- **ES384**：使用 P-384 和 SHA-384 的 ECDSA
- **ES512**：使用 P-521 和 SHA-512 的 ECDSA
- **EdDSA**：使用 Ed25519 的 EdDSA

## JWT 中间件
JWT 认证中间件通过使用 JWT 验证令牌来提供身份验证。`Authorization` 头的值或通过 `cookie` 选项指定的 `cookie` 值将被用作令牌。
`Authorization: Bearer <token>`

### 导入
```ts
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
```

### 使用
```ts
// Specify the variable types to infer the `c.get('jwtPayload')`:
// 指定变量类型以推断 `c.get('jwtPayload')` 的类型：
type Variables = JwtVariables

const app = new Hono<{ Variables: Variables }>()

app.use(
  '/auth/*',
  jwt({
    secret: 'it-is-very-secret',
  })
)

app.get('/auth/page', (c) => {
  return c.text('You are authorized')
})
```

获取载荷
```ts
const app = new Hono()

app.use(
  '/auth/*',
  jwt({
    secret: 'it-is-very-secret',
  })
)

app.get('/auth/page', (c) => {
  const payload = c.get('jwtPayload')
  return c.json(payload) // eg: { "sub": "1234567890", "name": "John Doe", "iat": 1516239022 }
})
```

### 选项
- **secret: string** - 必填
  - 您的密钥值。
- **cookie: string**
  - 如果设置了这个值，那么会使用该值作为键从 `cookie` 头中获取对应的值，并将其作为令牌进行验证。
- **alg: string**
  - 用于验证的算法类型。可用的类型有：HS256 | HS384 | HS512 | RS256 | RS384 | RS512 | PS256 | PS384 | PS512 | ES256 | ES384 | ES512 | EdDSA。默认值是 HS256。


## CORS中间件
### 导入
```ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
```

### 用法
```ts
const app = new Hono()

app.use('/api/*', cors())

app.use(
  '/api2/*',
  cors({
    origin: 'http://example.com',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
)

app.all('/api/abc', (c) => {
  return c.json({ success: true })
})
app.all('/api2/abc', (c) => {
  return c.json({ success: true })
})
```

多个origin
```ts
app.use(
  '/api3/*',
  cors({
    origin: ['https://example.com', 'https://example.org'],
  })
)

// Or you can use "function"
app.use(
  '/api4/*',
  cors({
    // `c` is a `Context` object
    origin: (origin, c) => {
      return origin.endsWith('.example.com') ? origin : 'http://example.com'
    },
  })
)
```

### 选项
- **`origin: string | string[] | (origin: string, c: Context) => string`**
  - CORS 头部中 "Access-Control-Allow-Origin" 的值。您也可以传递回调函数，例如 `origin: (origin) => (origin.endsWith('.example.com') ? origin : 'http://example.com')`。默认值为 `*`。
- **`allowMethods: string[]`**
  - CORS 头部中 "Access-Control-Allow-Methods" 的值。默认值为 `['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH']`。
- **`allowHeaders: string[]`**
  - CORS 头部中 "Access-Control-Allow-Headers" 的值。默认值为空数组 `[]`。
- **`maxAge: number`**
  - CORS 头部中 "Access-Control-Max-Age" 的值。
- **`credentials: boolean`**
  - CORS 头部中 "Access-Control-Allow-Credentials" 的值。
- **`exposeHeaders: string[]`**
  - CORS 头部中 "Access-Control-Expose-Headers" 的值。默认值为空数组 `[]`。