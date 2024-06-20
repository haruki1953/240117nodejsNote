- [设置和配置 ](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration)
	- 介绍
	- 生成 Prisma 客户端 
	- 实例化 Prisma 客户端 
		- 您的应用程序通常应该只创建 **一个** 实例 `PrismaClient`
	- 数据库连接 
	- 自定义模型和字段名称 
	- 配置错误格式
- [查询](https://www.prisma.io/docs/orm/prisma-client/queries)
	- 增删改查
	- 选择字段
	- 关系查询
	- 过滤和排序


## 增删改查
https://www.prisma.io/docs/orm/prisma-client/queries/crud

本页介绍如何使用生成的 Prisma 客户端 API 执行 CRUD 操作。 CRUD 是一个缩写词，代表：
- [Create](https://www.prisma.io/docs/orm/prisma-client/queries/crud#create)
- [Read](https://www.prisma.io/docs/orm/prisma-client/queries/crud#read)
- [Update](https://www.prisma.io/docs/orm/prisma-client/queries/crud#update)
- [Delete](https://www.prisma.io/docs/orm/prisma-client/queries/crud#delete)

有关每种方法的详细说明，请参阅 [Prisma 客户端 API 参考文档。](https://www.prisma.io/docs/orm/reference/prisma-client-reference)

（内容好多😵，只记一下最基本的吧，以后要实现复杂的功能主要还是靠查文档）

### Create
以下查询创建 ( [`create()`](https://www.prisma.io/docs/orm/reference/prisma-client-reference#create)）具有两个字段的单个用户：
```ts
const user = await prisma.user.create({
  data: {
    email: 'elsa@prisma.io',
    name: 'Elsa Prisma',
  },
})
```
用户的 `id` 是自动生成的

### Read
以下查询返回单个记录 ( [`findUnique()`](https://www.prisma.io/docs/orm/reference/prisma-client-reference#findunique)) 通过唯一标识符或 ID：
```ts
// By unique identifier
const user = await prisma.user.findUnique({
  where: {
    email: 'elsa@prisma.io',
  },
})

// By ID
const user = await prisma.user.findUnique({
  where: {
    id: 99,
  },
})
```

下列 [`findMany()`](https://www.prisma.io/docs/orm/reference/prisma-client-reference#findmany) 查询返回 _全部_ `User` 记录：
```ts
const users = await prisma.user.findMany()
```
您还可以 [对结果进行分页](https://www.prisma.io/docs/orm/prisma-client/queries/pagination) 。


### Update
以下查询使用 [`update()`](https://www.prisma.io/docs/orm/reference/prisma-client-reference#update) 根据 `email` 查找并更新单个 `User` 记录:
```ts
const updateUser = await prisma.user.update({
  where: {
    email: 'viola@prisma.io',
  },
  data: {
    name: 'Viola the Magnificent',
  },
})
```

以下查询使用 [`updateMany()`](https://www.prisma.io/docs/orm/reference/prisma-client-reference#updatemany) 来更新所有 `email` 包含 `prisma.io` 的 `User` 记录：
```ts
const updateUsers = await prisma.user.updateMany({
  where: {
    email: {
      contains: 'prisma.io',
    },
  },
  data: {
    role: 'ADMIN',
  },
})
```

### Delete
以下查询使用 [`delete()`](https://www.prisma.io/docs/orm/reference/prisma-client-reference#delete) 删除单个 `User` 记录：
```ts
const deleteUser = await prisma.user.delete({
  where: {
    email: 'bert@prisma.io',
  },
})
```
尝试删除具有一个或多个帖子的用户会导致错误，因为每个 `Post` 需要作者 - 请参阅 [级联删除](https://www.prisma.io/docs/orm/prisma-client/queries/crud#cascading-deletes-deleting-related-records) 。


## 选择字段
1. **默认选择集**：
   - 默认情况下，当查询返回记录时，结果包括所有在 Prisma schema 中定义的标量字段（包括枚举），但不包括关系字段。

2. **使用 `select` 返回特定字段**：
   - 你可以使用 `select` 来返回特定的字段，而不是所有字段。例如，以下查询只返回 `email` 和 `name` 字段：
     ```javascript
     const getUser = await prisma.user.findUnique({  
       where: {  
         id: 22,  
       },  
       select: {  
         email: true,  
         name: true,  
       },  
     })  
     ```
   - 你也可以使用嵌套的 `select` 来包括关系字段。

3. **使用 `include` 显式包括关系**：
   - 你可以使用 `include` 来显式包括关系字段。例如，以下查询返回所有用户字段以及每个相关帖子（post）的 `title` 字段：
     ```javascript
     const users = await prisma.user.findMany({  
       include: {  
         posts: {  
           select: {  
             title: true,  
           },  
         },  
       },  
     })  
     ```

4. **选择特定关系字段**：
   - 你可以使用嵌套的 `select` 或在 `include` 中使用 `select` 来返回特定的关系字段。例如，以下查询返回每个用户的 `name` 以及每个相关帖子的 `title`：
     ```javascript
     const users = await prisma.user.findMany({  
       select: {  
         name: true,  
         posts: {  
           select: {  
             title: true,  
           },  
         },  
       },  
     })  
     ```

5. **减少响应大小和提高查询速度**：
   - 选择仅需要的字段和关系，而不是依赖默认选择集，可以减少响应大小并提高查询速度。

6. **关系加载策略**：
   - 从版本 5.9.0 开始，当使用 `include` 或在关系字段上使用 `select` 进行关系查询时，你可以指定 `relationLoadStrategy` 来决定是使用数据库级联接还是执行多个查询并在应用程序级别合并数据。

更多详细信息可以参考以下链接：
- [Select specific fields](https://www.prisma.io/docs/orm/prisma-client/queries/select-fields#select-specific-fields)
- [Include relations and select relation fields](https://www.prisma.io/docs/orm/prisma-client/queries/select-fields#include-relations-and-select-relation-fields)


## 关系查询
https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries

以下示例返回单个用户和该用户的帖子：
```ts
const user = await prisma.user.findFirst({
  include: {
    posts: true,
  },
})
```

你可以嵌套 `include` 选项来包含关系的关系。以下示例返回一个用户的帖子，以及每个帖子的类别：
```ts
const user = await prisma.user.findFirst({
  include: {
    posts: {
      include: {
        categories: true,
      },
    },
  },
})
```