// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()


/*** 中间件 ***/
// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())
// 配置解析urlencoded表单的中间件
app.use(express.urlencoded({ extended: false }))

/*** 自定义中间件 ***/
// 响应数据的中间件
app.use((req, res, next) => {
  // res.cc() 函数，简化响应处理失败的结果
  // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
  res.cc = (err, status = 1) => {
    res.send({
      // 状态
      status,
      // 状态描述，判断 err 是 错误对象 还是 字符串
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

// 一定要在路由之前配置解析 Token 的中间件
const expressJWT = require('express-jwt')
const config = require('./config')
// /api /uploads 开头的路径不用身份验证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/, /^\/uploads/] }))

// 托管静态资源文件 
app.use('/uploads', express.static('./uploads'))

/*** 路由 ***/
// 导入名注册用户路由模块，前缀为 /api
const useRouter = require('./router/user')
app.use('/api', useRouter)

// 导入并使用用户信息路由模块，注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

// 导入并使用文章分类路由模块 为文章分类的路由挂载统一的访问前缀 /my/article
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)

// 导入并使用文章路由模块 为文章的路由挂载统一的访问前缀 /my/article
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)


/*** 全局错误中间件***/
const joi = require('joi')
// 错误中间件
app.use(function (err, req, res, next) {
  // 数据验证失败的错误
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 身份认证失败的错误 
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  // 未知错误
  res.cc(err)
})


// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3007, function () {
  console.log('api server running at http://127.0.0.1:3007')
})
