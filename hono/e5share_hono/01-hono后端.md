后端地址 

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






## 二、配置数据库
