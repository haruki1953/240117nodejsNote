https://www.prisma.io/docs/orm/prisma-schema/overview
## 数据源
在调用 CLI 命令或运行 Prisma Client 查询时，可以使用环境变量来提供配置选项。

虽然可以在模式中直接硬编码 URL，但不推荐这样做，因为这存在安全风险。在模式中使用环境变量可以将敏感信息从模式中移出，从而提高模式的可移植性，使其能够在不同的环境中使用。

可以使用 `env()` 函数来访问环境变量：（对应项目根目录下的 .env 文件）
```
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

对于sqlite数据库，因为是本地的，个人感觉直接写就行
```
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

## 数据模型
https://www.prisma.io/docs/orm/prisma-schema/data-model/models

