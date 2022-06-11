// 导入密码加密包
const bcrypt = require('bcryptjs')
const { getUserInfo } = require('../service/user.service')
const { userFormateError, userAlreadyExited, userRegisterError, userDoesNotExit, userLoginError, invalidPassword } = require('../constant/err.type')


const userValidator = async (ctx, next) => {
  const { user_name, password } = ctx.request.body
  // 判断：合法性
  if (!user_name || !password) {
    console.error('用户名或密码为空', ctx.request.body)
    // 提交错误到统一错误处理中间件
    // error(自定义事件)，错误对象，请求上下文
    ctx.app.emit('error', userFormateError, ctx)
    return // 不然下面代码执行
  }
  await next()
}


const verifyUser = async (ctx, next) => {
  const { user_name } = ctx.request.body

  // 判断：合理性
  try {
    const res = await getUserInfo({ user_name })
    if (res) {
      console.error('用户名已经存在', { user_name })
      ctx.app.emit('error', userAlreadyExited, ctx)
      return
    }
  } catch (err) {
    console.error('获取用户信息错误', err)
    ctx.app.emit('error', userRegisterError, ctx)
    return
  }

  await next()
}

const cryptPassword = async (ctx, next) => {
  const { password } = ctx.request.body
  const salt = bcrypt.genSaltSync(10)
  // hash保存的是 密文
  const hash = bcrypt.hashSync(password, salt)
  ctx.request.body.password = hash
  await next()
}


const verifyLogin = async (ctx, next) => {
  // 1. 判断用户是否存在(不存在报错)
  const { user_name, password } = ctx.request.body

  // 注意：try..catch 有块级作用域
  try {
    const res = await getUserInfo({ user_name })
    if (!res) {
      console.error('用户不存在', { user_name })
      ctx.app.emit('error', userDoesNotExit, ctx)
      return
    }
    // 2. 密码是否匹配(不匹配: 报错)
    if (!bcrypt.compareSync(password, res.password)) {
      ctx.app.emit('error', invalidPassword, ctx)
      return
    }
  } catch (err) {
    console.error(err)
    return ctx.app.emit('error', userLoginError, ctx)
  }





  await next()
}

module.exports = {
  userValidator,
  verifyUser,
  cryptPassword,
  verifyLogin
}