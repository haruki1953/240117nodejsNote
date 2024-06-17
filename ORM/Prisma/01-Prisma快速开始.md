https://www.prisma.io/docs/getting-started/quickstart

在这个快速入门指南中，您将学习如何从头开始，使用纯 TypeScript 项目和本地 SQLite 数据库文件来开始使用 Prisma ORM。本指南涵盖了数据建模、迁移和数据库查询。

## 1.创建TypeScript项目并设置Prisma ORM
需要 Node.js v16.13.0 或更高版本

第一步，创建一个项目目录并导航到其中：
```
mkdir hello-prismacd hello-prisma
```

接下来，使用 npm 初始化 TypeScript 项目：
```
# npm init -y
# npm install typescript ts-node @types/node --save-dev
pnpm install typescript ts-node @types/node --save-dev
```
这创建了一个 `package.json` 为您的 TypeScript 应用程序进行初始设置。

现在，初始化 TypeScript：
```
# npx tsc --init
pnpm exec tsc --init
```

在项目中安装 Prisma CLI 作为开发依赖项：
```
pnpm install prisma --save-dev
```

使用 Prisma CLI 的 init 命令来设置 Prisma ORM：
```bash
# npx prisma init --datasource-provider sqlite
pnpm exec prisma init --datasource-provider sqlite
```

这将创建一个新的 prisma 目录，并生成一个 prisma.schema 文件，配置 SQLite 作为您的数据库。现在，您可以开始对数据进行建模，并创建包含一些表的数据库了。
```
$ pnpm exec prisma init --datasource-provider sqlite

✔ Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.

warn You already have a .gitignore file. Don't forget to add `.env` in it to not commit any private information.

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Run prisma db pull to turn your database schema into a Prisma schema.
3. Run prisma generate to generate the Prisma Client. You can then start querying your database.

More information in our documentation:
https://pris.ly/d/getting-started

┌────────────────────────────────────────────────────────────────┐
│  Developing real-time features?                                │
│  Prisma Pulse lets you respond instantly to database changes.  │
│  https://pris.ly/cli/pulse                                     │
└────────────────────────────────────────────────────────────────┘

这是`pnpm exec prisma init --datasource-provider sqlite`命令的输出，它表示你已经成功地使用Prisma和SQLite初始化了一个新的项目。以下是输出的主要内容：
1. 你的Prisma模式文件已经在`prisma/schema.prisma`创建好了，你现在可以用你喜欢的编辑器打开它。
2. 如果你已经有一个`.gitignore`文件，别忘了在其中添加`.env`，以防止提交任何私人信息。

接下来的步骤包括：
1. 在`.env`文件中设置`DATABASE_URL`，使其指向你现有的数据库。如果你的数据库还没有表，你可以阅读[这个链接](https://pris.ly/d/getting-started)了解如何开始。
2. 运行`prisma db pull`将你的数据库模式转换为Prisma模式。
3. 运行`prisma generate`生成Prisma客户端。然后你就可以开始查询你的数据库了。

如果你需要更多的信息，你可以查阅Prisma的[文档](https://pris.ly/d/getting-started)。

最后，如果你正在开发实时功能，Prisma Pulse可以让你立即响应数据库的变化。你可以在[这个链接](https://pris.ly/cli/pulse)了解更多。
```

## 2. 在 Prisma 模式中对数据进行建模
Prisma 模式提供了一种直观的数据建模方法。 将以下模型添加到您的 `schema.prisma` 文件：
prisma/schema.prisma
```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}
```
- [PrismaSchema文件解释](笔记/PrismaSchema文件解释.md)
	- 在底层数据库表中，`User` 表中没有 `posts` 字段，`Post` 表中也没有 `author` 字段。这些字段在 Prisma schema 文件中用于表示模型之间的关系
- [vscode启用Prisma的语法高亮](笔记/vscode启用Prisma的语法高亮.md)

Prisma schema 中的模型有两个主要目的：
1. 表示底层数据库中的表格结构。
2. 作为生成的 Prisma Client API 的基础。

在接下来的部分，你将使用 Prisma Migrate 将这些模型映射到数据库表格。


## 3. 运行迁移以使用 Prisma Migrate 创建数据库表
此时，您有一个 Prisma schema，但还没有数据库。在终端中运行以下命令，以创建 SQLite 数据库和由您的模型表示的 User 和 Post 表：
```sh
# npx prisma migrate dev --name init
pnpm exec prisma migrate dev --name init
```

```
$ pnpm exec prisma migrate dev --name init
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"

SQLite database dev.db created at file:./dev.db

Applying migration `20240617084829_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20240617084829_init/
    └─ migration.sql

Your database is now in sync with your schema.

Running generate... (Use --skip-generate to skip the generators)
Packages: +1
+
Progress: resolved 39, reused 15, downloaded 1, added 1, done
node_modules/.pnpm/@prisma+client@5.15.0_prisma@5.15.0/node_modules/@prisma/client: Running postinstall script, done in 297ms

dependencies:
+ @prisma/client 5.15.0

Done in 56.2s

✔ Generated Prisma Client (v5.15.0) to .\node_modules\.pnpm\@prisma+client@5.15.0_prisma@5.15.0\node_modules\@prisma\client in 166ms
```

这个命令完成了三件事：
1. 在 `prisma/migrations` 目录中为此次迁移创建了一个新的 SQL 迁移文件。
2. 将这个 SQL 迁移文件应用到数据库。
3. 在底层运行了 `prisma generate` 命令（安装了 `@prisma/client` 包，并根据您的模型生成了定制的 Prisma Client API）。

因为之前 SQLite 数据库文件并不存在，所以这个命令还在 `prisma` 目录中创建了一个名为 `dev.db` 的文件，如 `.env` 文件中的环境变量所定义的那样。

恭喜，您现在已经准备好了数据库和表。接下来，让我们学习如何发送一些查询来读取和写入数据吧！


## 4. 探索如何使用 Prisma Client 向数据库发送查询
要向数据库发送查询，您需要一个 TypeScript 文件来执行您的 Prisma Client 查询。为此，创建一个名为 `script.ts` 的新文件：
```sh
touch script.ts
```

然后，将以下样板代码粘贴到其中：
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ... 您将在这里编写您的 Prisma Client 查询
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

这个代码包含了一个 `main` 函数，该函数在脚本的末尾被调用。它还实例化了 `PrismaClient`，该实例代表了您与数据库交互的查询接口。

### 4.1. 创建一个新的 `User` 记录
让我们从一个小查询开始，来在数据库中创建一个新的 `User`记录，并将结果对象记录到控制台。 将以下代码添加到您的 `script.ts` 文件：
```ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@prisma.io',
    },
  })
  console.log(user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

与其复制代码，您可以在编辑器中手动键入以体验 Prisma 客户端提供的自动补全功能。此外，您还可以通过在键盘上按 CTRL+SPACE 键来主动调用自动补全功能。
> 自动补全应该是 CTRL+I

接下来，使用以下命令执行脚本：
```
# npx ts-node script.ts
pnpm exec ts-node script.ts
```
结果
```
{ id: 1, email: 'alice@prisma.io', name: 'Alice' }
```
干得好，您刚刚使用 Prisma 客户端创建了您的第一个数据库记录！ 🎉

在下一节中，您将学习如何从数据库读取数据。

### 4.2. 查询全部 `User` 记录
Prisma 客户端提供了各种查询来从数据库中读取数据。在本节中，您将使用 `findMany` 查询，返回给定模型中数据库中的所有记录。
```ts
async function main() {
  const users = await prisma.user.findMany()
  console.log(users)
}
```
结果
```
[{ id: 1, email: 'alice@prisma.io', name: 'Alice' }]
```

### 4.3. 使用 Prisma 客户端探索关系查询
Prisma Client 的主要功能之一是便于处理关系。在本节中，您将学习如何在嵌套写入查询中创建一个用户（User）和一条帖子记录（Post）。之后，您将看到如何使用 `include` 选项从数据库中检索关系。

首先，调整您的脚本以包含嵌套查询（创建）：
`script.ts`
```typescript
async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@prisma.io',
      posts: {
        create: [
          {
            title: 'Hello World',
            published: true
          },
          {
            title: 'My second post',
            content: 'This is still a draft'
          }
        ],
      },
    },
  })
  console.log(user)
}
```

通过再次执行脚本来运行查询：
```json
{ id: 2, email: 'bob@prisma.io', name: 'Bob' }
```

默认情况下，Prisma Client 仅返回查询结果对象中的 ***标量*** 字段。这就是为什么即使您还为新用户记录创建了一个新的帖子记录，控制台也只打印了一个包含三个标量字段的对象：id、email 和 name。

为了还检索属于用户的帖子记录，您可以通过 `posts` 关系字段使用 `include` 选项：
`script.ts`
```typescript
async function main() {
  const usersWithPosts = await prisma.user.findMany({
    include: {
      posts: true,
    },
  })
  console.dir(usersWithPosts, { depth: null })
}
```
[console.dir控制对象的输出格式](笔记/console.dir控制对象的输出格式.md)

再次运行脚本以查看嵌套读取查询的结果：
```json
[
  { id: 1, email: 'alice@prisma.io', name: 'Alice', posts: [] },
  {
    id: 2,
    email: 'bob@prisma.io',
    name: 'Bob',
    posts: [
      {
        id: 1,
        title: 'Hello World',
        content: null,
        published: true,
        authorId: 2
      },
      {
        id: 2,
        title: 'My second post',
        content: 'This is still a draft',
        published: false,
        authorId: 2
      }
    ]
  }
]
```

这次，您将看到打印了两个用户对象。它们都有一个 `posts` 字段（“Alice”的 `posts` 为空，而 “Bob” 的 `posts` 填充了两个帖子对象），这些字段表示与它们关联的帖子记录。

请注意，`usersWithPosts` 数组中的对象也是完全类型化的。这意味着您将获得自动完成功能，并且 TypeScript 编译器将防止您意外输入错误。


## 5. 后续步骤
在本快速入门指南中，您学习了如何在普通 TypeScript 项目中开始使用 Prisma ORM。 您可以自行更多地探索 Prisma 客户端 API，例如，在 `findMany` 查询或探索更多操作，例如 `update` 和 `delete` 查询。

### 探索 Prisma Studio 中的数据【内置GUI数据库】
Prisma ORM 附带一个内置 GUI，用于查看和编辑数据库中的数据。 您可以使用以下命令打开它：
```
# npx prisma studio
pnpm exec prisma studio

$ pnpm exec prisma studio
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Prisma Studio is up on http://localhost:5555
```
![](assets/Pasted%20image%2020240617181850.png)
> 好厉害😱，被小小的震撼到了🥵
> 执行时火绒会弹出提示，应该是要调用powershell打开浏览器，允许还是阻止都没问题

### 使用您自己的数据库设置 Prisma ORM
如果您想使用自己的 PostgreSQL、MySQL、MongoDB 或任何其他受支持的数据库继续使用 Prisma ORM，请按照设置 Prisma ORM 指南进行操作：
- [从头开始使用 Prisma ORM](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql)
- [将 Prisma ORM 添加到现有项目](https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project)

### 探索可立即运行的 Prisma ORM 示例
查看 [`prisma-examples`](https://github.com/prisma/prisma-examples/)

GitHub 上的存储库，了解如何将 Prisma ORM 与您最喜欢的库一起使用。 该存储库包含 Express、NestJS、GraphQL 的示例以及 Next.js 和 Vue.js 的全栈示例等等。
> 可以看看如何在项目中规范的使用Prisma

### 使用 Prisma ORM 构建应用程序
Prisma 博客提供有关 Prisma ORM 的综合教程，请查看我们的最新教程：
- [使用 Next.js 构建全栈应用程序](https://www.youtube.com/watch?v=QXxy8Uv1LnQ&ab_channel=ByteGrad)
- [使用 Remix 构建全栈应用程序](https://www.prisma.io/blog/fullstack-remix-prisma-mongodb-1-7D0BfTXBmB6r) （5 部分，包括视频）
- [使用 NestJS 构建 REST API](https://www.prisma.io/blog/nestjs-prisma-rest-api-7D056s1BmOL0)

