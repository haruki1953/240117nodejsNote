后端地址 https://github.com/haruki1953/e5share-hono

## 一、初始化项目
### 创建项目
```
pnpm create hono@latest e5share-hono
```
选择node.js

### eslint
[02-eslint](02-eslint.md)

### 规范项目结构
在src目录中新建文件夹：
- routers
- schemas
- services
- utils

新建文件
- config.ts

将路由放在routers目录中的文件中，在入口文件导入并安装

通过环境变量获取端口，配置默认端口
```ts
const port = Number(process.env.E5SHARE_HONO_PORT || 50504);

let port = Number(process.env.E5SHARE_HONO_PORT)
if (Number.isNaN(port)) {
  port = 50504
}
```

通过 `tsconfig.json` 文件来配置路径别名
```
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}

```

创建git版本库，提交并推送

### 【问题解决】
#### 解决 .eslintrc.js 报错
修改tsconfig.json 
```
{
  "compilerOptions": {
    // ...其他编译器选项...
  },
  "include": [
    "src/**/*.ts", // 包含src目录下的所有.ts文件
    ".eslintrc.js"
  ]
}

```
（其实还不太清楚，先用着再说吧）


## 二、配置数据库
### 配置Prisma
在项目中安装 Prisma CLI 作为开发依赖项：
```
pnpm install prisma --save-dev
```

使用 Prisma CLI 的 init 命令来设置 Prisma ORM：
```bash
# npx prisma init --datasource-provider sqlite
pnpm exec prisma init --datasource-provider sqlite
```

修改，对于sqlite本地数据库没必要使用 `.env` 文件
```
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### 数据建模
```
model User {
  id                   Int                @id @default(autoincrement())
  username             String             @unique
  passwordHash         String
  email                String             @unique
  nickname             String?
  avatar               String?
  contactInfo          String?
  bio                  String?
  registeredAt         DateTime           @default(now())
  lastLogin            DateTime           @default(now())
  accountStatus        String             @default("active")
  e5SubscriptionDate   DateTime?
  e5ExpirationDate     DateTime?
  helpingUsers         String             @default("[]")
  helpedUsers          String             @default("[]")
  helpingByUsers       String             @default("[]")
  helpedByUsers        String             @default("[]")
  note                 String?
  userE5Post           UserE5Post?
  userNotification     UserNotification?
  usersE5SharedInfo    UsersE5SharedInfo?
}

model UserE5Post {
  id       Int   @id @default(autoincrement())
  userId   Int   @unique
  posts    String @default("[]")
  user     User  @relation(fields: [userId], references: [id])
}

model UserNotification {
  id            Int   @id @default(autoincrement())
  userId        Int   @unique
  notifications String @default("[]")
  user          User  @relation(fields: [userId], references: [id])
}

model UsersE5SharedInfo {
  id         Int   @id @default(autoincrement())
  userId     Int   @unique
  sharedInfo String @default("[]")
  user       User  @relation(fields: [userId], references: [id])
}
```


### 迁移（创建数据库表）
运行迁移以使用 Prisma Migrate 创建数据库表
```sh
# npx prisma migrate dev --name init
pnpm exec prisma migrate dev --name init
```

`dev.db` 和 `dev.db-journal` 文件是由 Prisma 在使用 SQLite 作为数据库时生成的文件。在开发环境中，通常不需要将这些文件加入到版本控制系统（如 Git）中，因此建议将它们添加到 `.gitignore` 文件中

Prisma ORM 附带一个内置 GUI，用于查看和编辑数据库中的数据。 您可以使用以下命令打开它：
```
pnpm exec prisma studio
```


## 三、项目起步
### 配置 cors 跨域
```ts
import { cors } from 'hono/cors'
app.use(cors())
```

### 响应数据处理
[04-最佳实践、项目规范【响应数据处理】](../04-最佳实践、项目规范.md#响应数据处理)

### 错误处理
[04-最佳实践、项目规范【接口与服务中的错误处理】](../04-最佳实践、项目规范.md#接口与服务中的错误处理)

```ts
app.notFound((c) => {
  return c.json(handleResData(1, '404 Not Found'))
})
```

### 表单校验
- [Zod](https://zod.dev) 
- [validation - Hono](https://hono.dev/docs/guides/validation#manual-validator)
- [Zod Validator 中间件](https://github.com/honojs/middleware/tree/main/packages/zod-validator)
```
pnpm add zod
pnpm add @hono/zod-validator
```

```ts
// src\schemas\user.ts
const username = z.string().regex(/^[a-zA-Z0-9_]{1,32}$/, {
  message: '用户名长度1到32 只能包含字母数字下划线'
})
const password = z.string().regex(/^[a-zA-Z0-9_]{6,32}$/, {
  message: '用户名长度6到32 只能包含字母数字下划线'
})
const email = z.string().email({ message: '请输入正确的邮箱' })
export const authRegisterJson = z.object({
  username, password, email
})

// src\routers\auth.ts
router.post('/register', zValidator('json', authRegisterJson), (c) => {
  return c.text('Hello Hono!')
})
// 下面增加 校验错误处理 时会修改为
router.post('/register', zValWEH('json', authRegisterJson), (c) => {
  return c.text('Hello Hono!')
})
```

#### 校验错误处理
- [Zod 错误处理](https://zod.dev/?id=error-handling)
- [Zod Validator 中间件](https://github.com/honojs/middleware/tree/main/packages/zod-validator)

zValidator校验失败的默认行为是返回响应，可以通过第三个参数传入回调来在校验失败是抛出错误（最终错误将在app.onError处理）。
```ts
zValidator('json', authRegisterJson, (result, c) => {
    if (!result.success) {
      throw new AppError(result.error.issues[0].message, 400)
    }
  })
```

为了不用在每次校验时都写回调函数，对zValidator进行封装。
```ts
// src\utils\zValHandlers.ts
type zValPar = Parameters<typeof zValidator>

// zValidator With Error Handler
export const zValWEH = (target: zValPar[0], schema: zValPar[1]): ReturnType<typeof zValidator> => {
  return zValidator(target, schema, (result, c) => {
    if (!result.success) {
      throw new AppError(result.error.issues[0].message, 400)
    }
  })
}
```

现在在校验时就调用zValWEH
```ts
router.post('/register', zValWEH('json', authRegisterJson), (c) => {
  return c.text('Hello Hono!')
})
```

笔记：[关于复杂的类型标注](笔记/关于复杂的类型标注.md)

## 四、登录注册功能
新建 routers/auth.ts，在入口文件导入














