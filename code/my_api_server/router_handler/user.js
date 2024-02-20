/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */

// 导入数据库操作模块
const db = require('../db/index')

// 导入 bcryptjs
const bcrypt = require('bcryptjs')

// 导入 jsonwebtoken 。用这个包来生成 Token 字符串 
const jwt = require('jsonwebtoken')

// 导入全局的配置文件
const config = require('../config')


// 注册用户的处理函数
/** @type {import("express").RequestHandler} */
module.exports.regUser = (req, res) => {

  /*** 检测表单数据是否合法 ***/
  //接收表单数据
  const userinfo = req.body
  // 判断数据是否合法，用户名与密码不能为空
  if (!userinfo.username || !userinfo.password) {
    return res.cc('用户名与密码不能为空')
  }


  /*** 检测用户名是否被占用 ***/
  // 定义SQL语句
  const sql = 'select * from ev_users where username=?'
  // 执行SQL语句并根据结果判断用户名是否被占用
  db.query(sql, [userinfo.username], (err, results) => {
    // 执行sql语句失败
    if (err) {
      return res.cc(err)
    }
    // 用户名被占用
    if (results.length > 0) {
      return res.cc('用户名已被占用，请更换其他用户名')
    }
    // TODO：用户名可用，继续后续流程


    /*** 对密码进行加密处理 ***/
    // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)


    /*** 插入新用户 ***/
    const sql = 'insert into ev_users set ?'
    db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
      // 执行 SQL 语句失败
      if (err) {
        return res.cc(err)
      }
      // SQL 语句执行成功，但影响行数不为 1
      if (results.affectedRows !== 1) {
        return res.cc('注册用户失败，请稍后再试！')
      }
      // 注册成功
      return res.cc('注册成功！', 0)
    })

  })
}




// 登录的处理函数
/** @type {import("express").RequestHandler} */
module.exports.login = (req, res) => {
  /*** 根据用户名查询用户的数据 ***/
  // 接收表单数据
  const userinfo = req.body
  // sql查询用户的数据
  const sql = 'select * from ev_users where username=?'
  db.query(sql, userinfo.username, (err, results) => {
    // sql执行失败
    if (err) {
      return res.cc(err)
    }
    // 执行 SQL 语句成功，但是查询到数据条数不等于 1
    if (results.length !== 1) {
      return res.cc('登录失败，查询到数据条数不等于 1')
    }

    /*** 判断用户输入的密码是否正确 ***/
    // 拿着用户输入的密码,和数据库中存储的密码进行对比
    const compareResults = bcrypt.compareSync(userinfo.password, results[0].password)
    // 如果对比结果为 fales，则证明密码错误
    if (!compareResults) {
      return res.cc('登陆失败，密码错误')
    }

    /*** 【登录成功】生成 JWT 的 Token 字符串 ***/
    // 在从数据库查到的用户信息中，剔除password和user_pic
    const user = { ...results[0], password: '', user_pic: '' }
    // 生成 Token 字符串 
    const tokenStr = jwt.sign(user,
      config.jwtSecretKey,  // 密钥
      { expiresIn: config.expiresIn } // token有效期
    )
    // 将生成的token字符串响应给客户端
    res.send({
      status: 0,
      message: '登录成功',
      token: 'Bearer ' + tokenStr,
    })
  })
}
