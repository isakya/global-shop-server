const { getUserInfo } = require('../service/user.service')
const { userFormateError, userAlreadyExited } = require('../constant/err.type')


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
  if (getUserInfo({ user_name })) {

    // 提交错误到统一错误处理中间件
    ctx.app.emit('error', userAlreadyExited, ctx)

    return
  }
  await next()
}

module.exports = {
  userValidator,
  verifyUser
}