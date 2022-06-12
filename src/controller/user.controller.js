const jwt = require('jsonwebtoken')
const { createUser, getUserInfo, updateById } = require('../service/user.service')
const { userRegisterError, changePwdError } = require('../constant/err.type')

const { JWT_SECRET } = require('../config/config.default')

class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    const { user_name, password } = ctx.request.body

    // try...catch 完善错误处理，因为操作数据库时可能会发生不明错误
    try {
      // 2. 操作数据库
      const res = await createUser(user_name, password)
      // 3. 返回结果
      ctx.body = {
        code: 0,
        message: '用户注册成功',
        result: {
          id: res.id,
          user_name: res.user_name
        }
      }
    } catch (err) {
      console.log(err)
      ctx.app.emit('error', userRegisterError, ctx)
    }
  }

  async login(ctx, next) {
    const { user_name } = ctx.request.body

    // 1. 获取用户信息（在token的payload中，记录id，user_name, is_admin）
    try {
      // 解构剔除 password 属性，将剩下的属性放到res
      const { password, ...res } = await getUserInfo({ user_name })
      ctx.body = {
        code: 0,
        message: '用户登陆成功',
        result: {
          token: jwt.sign(res, JWT_SECRET, { expiresIn: '1d' })
        }
      }
    } catch (err) {
      console.error('用户登陆失败', err)
    }
  }

  async changePassword(ctx, next) {
    // 1. 获取数据
    const id = ctx.state.user.id
    const password = ctx.request.body.password
    // 2. 操作数据库
    try {
      await updateById({ id, password })
      // 3. 返回结果
      ctx.body = {
        code: 0,
        message: '修改密码成功',
        result: ''
      }
    } catch (err) {
      console.error(err)
      ctx.app.emit('error', changePwdError, ctx)
    }
  }
}

module.exports = new UserController()